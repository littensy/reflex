/**
 * A Producer is a state container that exposes a set of dispatchers that can
 * be used to modify the state. The state is immutable, so the dispatchers
 * return a new state object.
 */
export type Producer<S, A> = InferDispatchersFromActions<A> & {
	/**
	 * Returns the current state of the producer.
	 */
	getState(): S;

	/**
	 * Calls the selector with the current state and returns the result.
	 * @param selector A function that selects a part of the state.
	 * @returns The result of the selector.
	 */
	select<Selection>(selector: (state: S) => Selection): Selection;

	/**
	 * Sets the state of the producer. Creates a shallow copy of the state
	 * object and fires the change event.
	 * @param newState The new state of the producer.
	 * @returns The new state.
	 */
	setState(newState: S): S;

	/**
	 * Returns the dispatchers for the actions.
	 */
	getDispatchers(): InferDispatchersFromActions<A>;

	/**
	 * Fires the change event if the state has changed.
	 */
	flush(): void;

	/**
	 * Subscribes to changes in the entire state. The callback is deferred
	 * from the frame that the state is changed.
	 * @param callback The callback to call when the state changes.
	 * @returns A function that unsubscribes the callback.
	 */
	subscribe(callback: (state: S, prevState: S) => void): () => void;

	/**
	 * Subscribes to changes in a specific part of the state. The callback is
	 * deferred from the frame that the state is changed.
	 * @param selector A function that selects a part of the state.
	 * @param callback The callback to call when the state changes.
	 * @returns A function that unsubscribes the callback.
	 */
	observe<Selection>(
		selector: (state: S) => Selection,
		callback: (state: Selection, prevState: Selection) => void,
	): () => void;

	/**
	 * Calls the callback once a specific part of the state changes, then
	 * unsubscribes from the state change event.
	 * @param selector A function that selects a part of the state.
	 * @param callback The callback to call when the state changes.
	 * @returns A function that unsubscribes the callback.
	 */
	once<Selection>(
		selector: (state: S) => Selection,
		callback: (state: Selection, prevState: Selection) => void,
	): () => void;

	/**
	 * Returns a Promise that resolves once a specific part of the state
	 * changes. Unsubscribes from the state change event when the Promise
	 * is cancelled or resolved.
	 * @param selector A function that selects a part of the state.
	 * @returns A Promise that resolves when the state changes.
	 */
	wait<Selection>(selector: (state: S) => Selection): Promise<Selection>;

	/**
	 * Disconnects all subscribers and cancel any pending flushes.
	 */
	destroy(): void;

	/**
	 * Enhances the producer with new functionality. The enhancer function
	 * is passed the producer as an argument and should mutate the producer
	 * in place.
	 * @param enhancer A function that enhances the producer.
	 * @returns The enhanced producer.
	 */
	enhance<T extends Producer<any, any>>(enhancer: (producer: Producer<S, A>) => T): T;

	/** @deprecated @hidden */
	Connect(callback: (newState: S) => void): RBXScriptConnection;

	/** @deprecated @hidden */
	Once(callback: (newState: S) => void): RBXScriptConnection;

	/** @deprecated @hidden */
	Wait(): LuaTuple<[S]>;
};

/**
 * A set of actions that is passed to the createProducer function.
 */
export type Actions<S> = Record<string, Action<S>>;

/**
 * An action is a function that takes the current state and returns a new
 * state.
 */
export type Action<S> = (state: S, ...args: any[]) => S;

/**
 * A dispatcher similar to an aciton, but omits the first `state` argument.
 * This is used to infer the dispatchers from the actions.
 */
export type InferDispatchersFromActions<A> = {
	[K in keyof A]: A[K] extends (state: infer S, ...args: infer A) => infer S ? (...args: A) => S : never;
};

/**
 * Infers the state type from a Producer.
 */
export type InferState<P> = P extends Producer<infer S, any> ? S : never;

/**
 * Infers the actions type from a Producer.
 */
export type InferActions<P> = P extends Producer<any, infer A> ? A : never;

/**
 * Infers the dispatchers type from a Producer.
 */
export type InferDispatchers<P> = P extends Producer<any, infer A> ? InferDispatchersFromActions<A> : never;

export type Middleware<T extends Producer<any, any> = Producer<unknown, Record<string, Callback>>> = (
	producer: T,
) => (done: NextMiddleware<InferActions<T>>) => NextMiddleware<InferActions<T>>;

export type NextMiddleware<A> = (action: MiddlewareAction<A>) => unknown;

export type MiddlewareAction<A = Record<string, unknown>> = {
	[K in keyof A]: {
		type: K;
		arguments: Parameters<A[K]> extends [any, ...infer Rest] ? Rest : unknown[];
	};
}[keyof A];

export type ProducerMap = Record<string, Producer<any, any>>;

export type CombineStates<Producers extends ProducerMap> = {
	[Key in keyof Producers]: Producers[Key] extends Producer<infer S, any> ? S : never;
};

export type CombineActions<Producers extends ProducerMap> = {
	[Key in keyof Producers]: (x: Producers[Key] extends Producer<any, infer A> ? A : never) => void;
}[keyof Producers] extends (x: infer I) => void
	? I
	: never;

export type CombineProducer<Producers extends ProducerMap> = Producer<
	CombineStates<Producers>,
	CombineActions<Producers>
>;

export type Selector<S extends any[] = any[], R = any> = (...args: S) => R;

export type AnySelectors = readonly Selector[];

export type InferSelectorArguments<Selectors extends AnySelectors> = {
	[Key in keyof Selectors]: Selectors[Key] extends Selector<infer S, any> ? S : never;
};

export type InferSelectorResults<Selectors extends AnySelectors> = {
	[Key in keyof Selectors]: Selectors[Key] extends Selector<any, infer R> ? R : never;
};
