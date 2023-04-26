import { Actions, InferDispatchersFromActions, Producer, Selector } from "./types";

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
export function createProducer<S, A extends Actions<S>>(initialState: S, actions: A): Producer<S, A>;
export function createProducer(initialState: unknown, actions: Actions<unknown>): Producer<unknown, Actions<unknown>> {
	const dispatchers = {} as InferDispatchersFromActions<Actions<unknown>>;

	const listeners = new Map<number, (state: unknown, prevState: unknown) => void>();
	let listenerIdCounter = 0;

	let state = initialState;
	let stateSinceFlush = initialState;
	let nextFlush: thread | undefined;

	const scheduleFlush = () => {
		if (nextFlush) {
			return;
		}

		nextFlush = task.defer(() => {
			nextFlush = undefined;
			producer.flush();
		});
	};

	const producer: Producer<unknown, Actions<unknown>> = {
		getState(selector?: Selector) {
			return selector ? selector(state) : state;
		},

		setState(newState: unknown) {
			state = newState;
			scheduleFlush();
		},

		getActions() {
			return actions;
		},

		getDispatchers() {
			return dispatchers;
		},

		flush() {
			if (nextFlush) {
				task.cancel(nextFlush);
				nextFlush = undefined;
			}

			if (state === stateSinceFlush) {
				return;
			}

			const prevState = stateSinceFlush;
			stateSinceFlush = state;

			for (const [, subscriber] of pairs(listeners)) {
				task.spawn(subscriber, state, prevState);
			}
		},

		subscribe(selectorOrListener: Selector | Callback, listenerOrUndefined?: Callback) {
			let selector = selectorOrListener;
			let listener = listenerOrUndefined!;

			if (!listenerOrUndefined) {
				selector = (state: unknown) => state;
				listener = selectorOrListener;
			}

			const id = listenerIdCounter++;

			let selection = selector(state);

			listeners.set(id, (newState) => {
				const newSelection: unknown = selector(newState);
				const prevSelection: unknown = selection;

				if (newSelection !== prevSelection) {
					selection = newSelection;
					listener(newSelection, prevSelection);
				}
			});

			return () => {
				listeners.delete(id);
			};
		},

		once(selector: Selector, listener: Callback) {
			const unsubscribe = this.subscribe(selector, (newState, prevState) => {
				unsubscribe();
				listener(newState, prevState);
			});

			return unsubscribe;
		},

		wait(selector: Selector) {
			return new Promise<any>((resolve, _, onCancel) => {
				onCancel(this.once(selector, resolve));
			});
		},

		destroy() {
			if (nextFlush) {
				task.cancel(nextFlush);
				nextFlush = undefined;
			}

			listeners.clear();
		},

		enhance(enhancer: Callback) {
			return enhancer(this);
		},

		Connect(listener: Callback) {
			const unsubscribe = this.subscribe(listener);
			return {
				Connected: true,
				Disconnect() {
					this.Connected = false;
					unsubscribe();
				},
			};
		},

		Once(listener: Callback) {
			const unsubscribe = this.once((state) => state, listener);
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
	};

	// Populate the dispatchers and producers objects
	for (const [actionName, action] of pairs(actions)) {
		const dispatcher = (...args: unknown[]) => {
			state = action(state, ...args);
			scheduleFlush();
			return state;
		};

		dispatchers[actionName] = dispatcher;
		producer[actionName] = dispatcher;
	}

	return producer;
}
