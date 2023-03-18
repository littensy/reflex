import { Actions, InferDispatchersFromActions, Producer } from "./types";

/**
 * Creates a producer that can be used to manage state.
 *
 * A producer is a state container that exposes a set of dispatchers that can
 * be used to modify the state. The state is immutable, so the dispatchers
 * return a new state object.
 *
 * The dispatchers are also exposed as callbacks in the producer, and are based
 * on the actions parameter, but with the first argument omitted.
 *
 * @param initialState The initial state of the producer.
 * @param actions A set of actions that can be used to modify the state.
 * @returns A producer that can be used to manage state.
 */
export function createProducer<S, A extends Actions<S>>(initialState: S, actions: A): Producer<S, A> {
	let state = initialState;
	let stateSinceFlush = initialState;

	let nextFlush: thread | undefined;
	let nextSubscriptionId = 0;

	const subscribers = new Map<number, (state: S, prevState: S) => void>();
	const dispatchers = {} as InferDispatchersFromActions<Actions<S>>;

	for (const [key, action] of pairs(actions as Actions<S>)) {
		dispatchers[key] = (...args: unknown[]) => {
			const prevState = state;
			state = action(prevState, ...args);

			if (prevState !== state && !nextFlush) {
				nextFlush = task.defer(() => {
					nextFlush = undefined;
					producer.flush();
				});
			}

			return state;
		};
	}

	const producer: Producer<S, {}> = {
		getState() {
			return state;
		},

		select(selector) {
			return selector(state);
		},

		setState(newState) {
			state = typeIs(newState, "table") ? table.clone(newState) : newState;

			if (!nextFlush) {
				nextFlush = task.defer(() => {
					nextFlush = undefined;
					this.flush();
				});
			}

			return state;
		},

		getDispatchers() {
			return dispatchers;
		},

		flush() {
			if (nextFlush) {
				task.cancel(nextFlush);
				nextFlush = undefined;
			}

			if (stateSinceFlush !== state) {
				const prevState = stateSinceFlush;
				stateSinceFlush = state;

				for (const [, subscriber] of subscribers) {
					subscriber(state, prevState);
				}
			}
		},

		subscribe(callback) {
			const id = nextSubscriptionId++;
			subscribers.set(id, callback);

			return () => {
				subscribers.delete(id);
			};
		},

		observe(selector, callback) {
			let selection = selector(state);

			return this.subscribe(() => {
				const newSelection = selector(state);

				if (selection !== newSelection) {
					const prevSelection = selection;
					selection = newSelection;
					callback(newSelection, prevSelection);
				}
			});
		},

		once(selector, callback) {
			const unsubscribe = this.observe(selector, (state, prevState) => {
				unsubscribe();
				callback(state, prevState);
			});

			return unsubscribe;
		},

		wait(selector) {
			return new Promise((resolve, _, onCancel) => {
				const unsubscribe = this.once(selector, resolve);
				onCancel(unsubscribe);
			});
		},

		destroy() {
			if (nextFlush) {
				task.cancel(nextFlush);
				nextFlush = undefined;
			}

			subscribers.clear();
		},

		Connect(callback) {
			const unsubscribe = this.subscribe(callback);
			return {
				Connected: true,
				Disconnect() {
					this.Connected = false;
					unsubscribe();
				},
			};
		},

		Once(callback) {
			const unsubscribe = this.once((state) => state, callback);
			return {
				Connected: true,
				Disconnect() {
					this.Connected = false;
					unsubscribe();
				},
			};
		},

		Wait() {
			return $tuple(this.wait((state) => state).expect());
		},

		...dispatchers,
	};

	return producer as Producer<S, A>;
}
