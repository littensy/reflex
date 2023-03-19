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
			flush();
		});
	};

	const getState = (selector?: Selector) => {
		return selector ? selector(state) : state;
	};

	const setState = (newState: unknown) => {
		state = newState;
		scheduleFlush();
	};

	const getActions = () => {
		return actions;
	};

	const getDispatchers = () => {
		return dispatchers;
	};

	const flush = () => {
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
			subscriber(state, prevState);
		}
	};

	const subscribe = (selectorOrListener: Selector | Callback, listenerOrUndefined?: Callback) => {
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
	};

	const once = (selector: Selector, listener: Callback) => {
		const unsubscribe = subscribe(selector, (newState, prevState) => {
			unsubscribe();
			listener(newState, prevState);
		});

		return unsubscribe;
	};

	const wait = (selector: Selector) => {
		return new Promise<any>((resolve, _, onCancel) => {
			onCancel(once(selector, resolve));
		});
	};

	const destroy = () => {
		if (nextFlush) {
			task.cancel(nextFlush);
			nextFlush = undefined;
		}

		listeners.clear();
	};

	const enhance = (enhancer: Callback) => {
		return enhancer(producer);
	};

	const connectRoblox = function (this: object, listener: Callback) {
		const unsubscribe = subscribe(listener);
		return {
			Connected: true,
			Disconnect() {
				this.Connected = false;
				unsubscribe();
			},
		};
	};

	const onceRoblox = function (this: object, listener: Callback) {
		const unsubscribe = once((state) => state, listener);
		return {
			Connected: true,
			Disconnect() {
				this.Connected = false;
				unsubscribe();
			},
		};
	};

	const waitRoblox = function (this: object) {
		return $tuple(wait((state) => state).expect());
	};

	const producer: Producer<unknown, Actions<unknown>> = {
		getState,
		setState,
		getActions,
		getDispatchers,
		flush,
		subscribe,
		once,
		wait,
		destroy,
		enhance,
		Connect: connectRoblox,
		Once: onceRoblox,
		Wait: waitRoblox,
	};

	// Populate the dispatchers and producers objects
	for (const [actionName, action] of pairs(actions)) {
		const dispatcher = (...args: unknown[]) => {
			const newState = action(state, ...args);
			setState(newState);
			return newState;
		};

		dispatchers[actionName] = dispatcher;
		producer[actionName] = dispatcher;
	}

	return producer;
}
