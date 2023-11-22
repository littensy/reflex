/**
 * Creates a producer that can be used to manage state.
 *
 * A producer is a state container that exposes a set of dispatchers that can
 * be used to modify the state. The state is immutable, so the dispatchers
 * return a new state object.
 *
 * The dispatchers are also exposed as callbacks in the producer, and are based
 * on the actions, but with the first argument (the state) omitted.
 *
 * @example
 * ```ts
 * const producer = createProducer({ count: 0 }, {
 * 	increment: (state, n: number) => ({ count: state.count + n }),
 * 	decrement: (state, n: number) => ({ count: state.count - n }),
 * });
 *
 * producer.increment(1); // { count: 1 }
 * producer.decrement(1); // { count: 0 }
 * ```
 *
 * @param initialState The initial state of the producer.
 * @param actions A set of actions that can be used to modify the state.
 * @return A producer that can be used to manage state.
 */
export declare function createProducer<State, Actions extends ProducerActions<State>>(
	initialState: State,
	actions: Actions,
): Producer<State, Actions>;

/**
 * Combines multiple producers into a single producer. Any dispatchers called
 * on the combined producer will call the dispatchers of the same name on each
 * of the producers passed in.
 *
 * **Don't use the individual producers.** The combined producer is the only
 * one that should be used to prevent unexpected behavior.
 *
 * @example
 * ```ts
 * export type RootProducer = typeof producer;
 * export type RootState = InferState<RootProducer>;
 *
 * export const producer = combineProducers({
 * 	foo: fooProducer,
 * 	bar: barProducer,
 * });
 * ```
 *
 * @param producers A map of producers to combine.
 * @return A combined producer.
 */
export declare function combineProducers<Producers extends ProducerMap>(
	producers: Producers,
): CombineProducers<Producers>;

/**
 * Creates a producer enhancer that applies the given middleware to every
 * function in the producer.
 *
 * A middleware is a function that is called before an action is dispatched.
 * It receives the `dispatch` function, the `resolveCurrentDispatcher` function,
 * and the `producer` object as arguments.
 *
 * The middleware returns a function that handles an incoming dispatcher call
 * by calling and returning the `dispatch` function.
 *
 * @example
 * ```ts
 * const loggerMiddleware: ProducerMiddleware = (dispatch, resolve, producer) => {
 * 	return (...args) => {
 * 		print(`producer.${resolve()} called`, ...args);
 * 		return dispatch(...args);
 * 	};
 * };
 *
 * producer.enhance(applyMiddleware(loggerMiddleware));
 * ```
 *
 * @deprecated Use `Producer.applyMiddleware` instead.
 * @param middlewares A list of middleware to apply.
 * @return A producer enhancer.
 */
export declare function applyMiddleware(...middlewares: ProducerMiddleware[]): <T extends Producer>(producer: T) => T;

/**
 * Creates a memoized selector function. The selector is only called if the
 * outputs of the dependencies have changed.
 *
 * This function is only necessary if your selector is expensive to compute,
 * or returns a new object (i.e. mapping an array). This is because selectors
 * are called every state change, and if the selector returns new objects, it
 * will be considered a change.
 *
 * @example
 * ```ts
 * const selectPlayers = createSelector(selectIds, (ids) => {
 * 	return ids.mapFiltered((id) => {
 * 		return Players.GetPlayerByUserId(id);
 * 	});
 * });
 * ```
 *
 * @param dependencies A list of dependencies that the selector depends on.
 * @param combiner A function that takes the dependencies as arguments and
 * returns the result of the selector.
 * @param options Options for memoizing the selector.
 * @return A memoized selector function.
 */
export declare function createSelector<Selectors extends SelectorArray, Result>(
	dependencies: [...Selectors],
	combiner: (...args: InferSelectorArrayResults<Selectors>) => Result,
	options?: MemoizeOptions<Result> | EqualityCheck<Result>,
): MergeSelectors<Selectors, Result>;

export declare function createSelector<Selectors extends SelectorArray, Result>(
	...args: [...dependencies: Selectors, combiner: (...args: InferSelectorArrayResults<Selectors>) => Result]
): MergeSelectors<Selectors, Result>;

export declare function createSelector<Selectors extends SelectorArray, Result>(
	...args: [
		...dependencies: Selectors,
		combiner: (...args: InferSelectorArrayResults<Selectors>) => Result,
		options: Result extends infer R ? MemoizeOptions<R> : never,
	]
): MergeSelectors<Selectors, Result>;

/**
 * Creates a broadcaster that can be used to share actions with the client.
 * It will track all actions that are dispatched by the provided producers and
 * will broadcast them to the client.
 *
 * @example
 * ```ts
 * const broadcaster = createBroadcaster({
 * 	producers: slices,
 * 	dispatch: (player, actions) => {
 * 		remotes.dispatch.fire(player, actions);
 * 	},
 * });
 *
 * remotes.start.connect((player) => {
 * 	broadcaster.start(player)
 * });
 *
 * rootProducer.applyMiddleware(broadcaster.middleware);
 * ```
 *
 * @server
 * @param options The options for the broadcaster.
 * @return The broadcaster.
 */
export declare function createBroadcaster<Producers extends ProducerMap>(
	options: BroadcasterOptions<Producers>,
): Broadcaster;

/**
 * Creates a broadcast receiver that can be used to receive actions from the
 * server. It will request the initial state from the server and will dispatch
 * any actions that are received from the server.
 *
 * @example
 * ```ts
 * const receiver = createBroadcastReceiver({
 * 	start: () => {
 * 		remotes.start.fire();
 * 	},
 * });
 *
 * remotes.dispatch.connect((actions) => {
 * 	receiver.dispatch(actions);
 * });
 *
 * rootProducer.applyMiddleware(receiver.middleware);
 * ```
 *
 * @client
 * @param options The options for the broadcast receiver.
 * @return The broadcast receiver.
 */
export declare function createBroadcastReceiver<Producers extends ProducerMap>(
	options: BroadcastReceiverOptions,
): BroadcastReceiver<Producers>;

/**
 * A middleware that logs all dispatched actions to the console.
 * @example
 * producer.applyMiddleware(loggerMiddleware);
 */
export declare const loggerMiddleware: ProducerMiddleware;

/**
 * Returns whether the two given values are shallowly equal.
 * @param a The first value.
 * @param b The second value.
 * @return Whether the two values are shallowly equal.
 */
export declare function shallowEqual(a: unknown, b: unknown): boolean;

/**
 * A Producer is a state container that exposes a set of dispatchers that can
 * be used to modify the state. The state is immmutable, so dispatchers return
 * a new state object.
 */
export type Producer<State = any, Actions = any> = ProducerDispatchers<State, Actions> & ProducerImpl<State, Actions>;

/**
 * An implementation of the Producer interface. This is used internally and
 * intersected with the action dispatchers.
 */
interface ProducerImpl<State, Actions> {
	/**
	 * Returns the current state.
	 * @return The state.
	 */
	getState(): State;

	getState<Selection>(selector: Selector<State, Selection>): Selection;

	/**
	 * Sets the state to the given value.
	 * @param state The new state.
	 */
	setState(state: State): void;

	/**
	 * Resets the state to the initial state.
	 */
	resetState(): void;

	/**
	 * Returns a list of the dispatcher functions derived from the action
	 * functions. These functions omit the first argument (the state) and
	 * return the new state.
	 */
	getDispatchers(): ProducerDispatchers<State, Actions>;

	/**
	 * Returns a list of the action functions passed to `createProducer`.
	 */
	getActions(): Actions;

	/**
	 * Returns a distinct copy of the producer. The copy starts with the same
	 * state and actions, but functions independently.
	 */
	clone(): Producer<State, Actions>;

	/**
	 * Flushes any pending updates to the state. This is called automatically
	 * one frame after the last state update, but can be called manually to
	 * force a synchronous flush.
	 */
	flush(): void;

	/**
	 * Subscribes to changes in the whole or parts of the state. Listener calls
	 * are deferred until the next frame after all state updates have been
	 * processed.
	 * @param selector An optional function that returns a subset of the state.
	 * @param predicate An optional predicate function that must return `true`
	 * for the listener to be called.
	 * @param listener Called when the selected part of the state changes.
	 * @return A function that unsubscribes from the listener.
	 */
	subscribe(listener: (state: State, previousState: State) => void): () => void;

	subscribe<T>(selector: (state: State) => T, listener: (state: T, previousState: T) => void): () => void;

	subscribe<T>(
		selector: (state: State) => T,
		predicate: ((state: T, previousState: T) => boolean) | undefined,
		listener: (state: T, previousState: T) => void,
	): () => void;

	/**
	 * Similar to `subscribe`, but the listener is disconnected after the first
	 * time it is called.
	 * @param selector A function that returns a subset of the state.
	 * @param predicate An optional predicate function that must return `true`
	 * for the listener to be called.
	 * @param listener Called when the selected part of the state changes.
	 * @return A function that unsubscribes from the listener.
	 */
	once<T>(selector: (state: State) => T, listener: (state: T, previousState: T) => void): () => void;

	once<T>(
		selector: (state: State) => T,
		predicate: ((state: T, previousState: T) => boolean) | undefined,
		listener: (state: T, previousState: T) => void,
	): () => void;

	/**
	 * Returns a Promise that resolves once a specific part of the state changes.
	 * Unsubscribes the listener if the Promise is cancelled or resolved.
	 *
	 * Receives an optional `predicate` function that must return `true` for the
	 * Promise to resolve for a given state change.
	 *
	 * @param selector A selector function that can be used to select a subset
	 * of the state.
	 * @param predicate An optional predicate function that must return `true`
	 * for the Promise to resolve for a given state change.
	 * @return A Promise that resolves once the selected part of the state changes.
	 */
	wait<T>(selector: (state: State) => T, predicate?: (state: T, previousState: T) => boolean): Promise<T>;

	/**
	 * Tracks the addition and removal of entries in an object. Calls the given
	 * observer for each added item and calls the cleanup function when the item
	 * is removed.
	 *
	 * If your state contains immutable objects, you can use the `discriminator`
	 * argument to return a unique identifier for each item. This allows the
	 * observer to avoid calling the observer for items that have already been
	 * added.
	 *
	 * @example
	 * ```
	 * // Observe the addition and removal of primitives in state.
	 * producer.observe((state) => state.ids, (id) => {
	 * 	print(`Added ${id}`);
	 * 	return () => print(`Removed ${id}`);
	 * });
	 *
	 * // Observe the addition and removal of objects in state.
	 * producer.observe((state) => state.items, (item) => item.id, (item) => {
	 * 	print(`Added ${item.id}`);
	 * 	return () => print(`Removed ${item.id}`);
	 * });
	 * ```
	 *
	 * @param selector The selector to track.
	 * @param discriminator Optional function that returns a unique identifier for
	 * each item. Useful when tracking immutable objects.
	 * @param observer The observer to call when an item is added. Returns a
	 * function that is called when the item is removed.
	 * @returns A cleanup function that removes all observers.
	 */
	observe<T>(
		selector: (state: State) => T,
		observer: (item: NonNullable<Values<T>>, index: Keys<T>) => (() => void) | void,
	): () => void;

	observe<T>(
		selector: (state: State) => T,
		discriminator: ((item: NonNullable<Values<T>>, index: Keys<T>) => defined) | undefined,
		observer: (item: NonNullable<Values<T>>, index: Keys<T>) => (() => void) | void,
	): () => void;

	/**
	 * Similar to `observe`, but it creates one observer while a selector or
	 * predicate is truthy, and destroys the observer when it's no longer truthy.
	 * @param selector The selector to track.
	 * @param predicate An optional predicate function that must return `true`
	 * for the observer to be created.
	 * @param observer The observer to call when the selector is truthy. Returns
	 * a function that is called when the selector is falsy.
	 * @returns A cleanup function that removes all observers.
	 */
	observeWhile<T>(
		selector: (state: State) => T | false | undefined,
		observer: (state: T, prevState: T) => (() => void) | void,
	): () => void;

	observeWhile<T>(
		selector: (state: State) => T,
		predicate: ((state: T, prevState: T) => boolean) | undefined,
		observer: (state: T) => (() => void) | void,
	): () => void;

	/**
	 * Disconnects all listeners and cancels all pending flushes.
	 */
	destroy(): void;

	/**
	 * Enhances the producer with new functionality. The enhancer function is
	 * passed to the producer as na argument and can patch the producer object
	 * with new methods.
	 *
	 * Consider using `applyMiddleware` instead of `enhance` to make it easier
	 * to compose enhancers/middleware.
	 *
	 * @param enhancer A function that patches the producer object.
	 * @return The enhanced producer.
	 */
	enhance<T>(enhancer: (producer: Producer<State, Actions>) => T): T;

	/**
	 * Applies the given middlewares to the producer and its dispatchers. Returns
	 * the producer for chaining.
	 *
	 * Initially, a middleware is called once when it is applied to a producer.
	 * Next, the returned function is called on a dispatcher in the producer.
	 * The final function is called whenever the dispatcher is called.
	 *
	 * @example
	 * ```ts
	 * const loggerMiddleware: ProducerMiddleware = (producer) => {
	 * 	print("Initial state:", producer.getState());
	 * 	return (dispatch, name) => (...args) => {
	 * 		print(`Dispatching ${name}:`, ...args);
	 * 		return dispatch(...args);
	 * 	};
	 * };
	 *
	 * producer.applyMiddleware(loggerMiddleware);
	 * ```
	 *
	 * @param middlewares A list of middleware to apply.
	 * @return The producer.
	 */
	applyMiddleware(...middlewares: ProducerMiddleware<State, Actions>[]): Producer<State, Actions>;
}

/**
 * Makes a type deeply immutable.
 */
export type DeepReadonly<T> = T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T;

/**
 * Infers the state type from a producer.
 * @template T The producer type.
 */
export type InferState<T> = T extends Producer<infer State> ? State : never;

/**
 * Infers the actions type from a producer.
 * @template T The producer type.
 */
export type InferActions<T> = T extends Producer<any, infer Actions> ? Actions : never;

/**
 * Infers the dispatcher functions from a producer.
 * @template T The producer type.
 */
export type InferDispatchers<T> = T extends Producer<infer State, infer Actions>
	? ProducerDispatchers<State, Actions>
	: never;

/**
 * A map of action names to action functions.
 * @template State The state type of the producer.
 */
export interface ProducerActions<State> {
	readonly [name: string]: (state: State, ...args: any[]) => State;
}

/**
 * Infers the dispatcher functions from the action functions. Dispatchers omit
 * the first argument (the state) and return the new state.
 * @template State The state type of the producer.
 * @template Actions The actions type of the producer.
 */
export type ProducerDispatchers<State, Actions> = {
	readonly [K in keyof Actions]: Actions[K] extends (state: State, ...args: infer Args) => State
		? (...args: Args) => State
		: never;
};

/**
 * A middleware is a function that is called before an action is dispatched.
 *
 * Initially, a middleware is called once when it is applied to a producer.
 * Next, the returned function is called on a dispatcher in the producer.
 * The final function is called whenever that dispatcher is called.
 */
export type ProducerMiddleware<State = any, Actions = any> = (
	producer: Producer<State, Actions>,
) => (dispatch: (...args: unknown[]) => unknown, name: string) => (...args: unknown[]) => unknown;

/**
 * Combines multiple producers into a single producer. The state of the
 * combined producer is a table with a key for each producer. Actions will
 * be called on the corresponding producer.
 * @template Producers A map of producer names to producers.
 */
export type CombineProducers<Producers extends ProducerMap> = Producer<
	CombineStates<Producers>,
	CombineActions<Producers>
>;

type ProducerMap = { readonly [name: string]: Producer };

type Keys<T> = T extends readonly any[] ? number : T extends ReadonlyMap<infer K, any> ? K : keyof T;

type Values<T> = T extends readonly any[] ? T[number] : T extends ReadonlyMap<any, infer V> ? V : T[keyof T];

type CombineStates<Producers extends ProducerMap> = {
	readonly [K in keyof Producers]: Producers[K] extends Producer<infer State, infer Actions> ? State : never;
};

type CombineActions<Producers extends ProducerMap> = IntersectObjectValues<{
	readonly [K in keyof Producers]: Producers[K] extends Producer<infer State, infer Actions>
		? ReplaceActionStateParameters<CombineStates<Producers>, Actions>
		: never;
}>;

type ReplaceActionStateParameters<State, Actions> = {
	readonly [K in keyof Actions]: Actions[K] extends (state: any, ...args: infer Args) => any
		? (state: State, ...args: Args) => State
		: never;
};

type IntersectObjectValues<T> = {
	[K in keyof T]: (x: T[K]) => void;
}[keyof T] extends (x: infer R) => void
	? R
	: never;

export interface MemoizeOptions<Result> {
	/**
	 * An equality check function that is used to compare the previous and
	 * current results of the combiner. If the function returns `true`, the
	 * previous result will be returned instead of the new result.
	 * @param current The new value.
	 * @param previous The previous value.
	 * @return `true` if the values are equal.
	 */
	readonly resultEqualityCheck?: EqualityCheck<Result>;

	/**
	 * An equality check function that is used to compare the previous and
	 * current arguments to the combiner. If the function returns `true`, the
	 * combiner will not be called and the previous result will be returned
	 * instead.
	 * @param current The new argument.
	 * @param previous The previous argument.
	 * @return `true` if the arguments are equal.
	 */
	readonly equalityCheck?: EqualityCheck;
}

/**
 * A selector function that can be used to select a subset of the state.
 * @param state The state.
 * @param params Optional parameters.
 * @return The selected part of the state.
 */
export type Selector<State = any, Result = unknown, Params extends never | any[] = any[]> = [Params] extends [never]
	? (state: State) => Result
	: (state: State, ...params: Params) => Result;

export type EqualityCheck<T = unknown> = (a: T, b: T) => boolean;

type SelectorArray = readonly Selector[];

type InferSelectorArrayResults<Selectors extends SelectorArray> = {
	[K in keyof Selectors]: Selectors[K] extends Selector<any, infer Result, any> ? Result : never;
};

type MergeSelectors<Selectors extends SelectorArray, Result> = Selector<
	Selectors[0] extends Selector<infer S> ? S : never,
	Result,
	{
		[K in keyof Selectors]: Selectors[K] extends Selector<any, any, infer Params>
			? Params extends []
				? never
				: Params
			: never;
	}[number]
>;

/**
 * A container for storing a Reflex dispatcher's name and arguments.
 */
export interface BroadcastAction {
	readonly name: string;
	readonly arguments: unknown[];
}

/**
 * Options for creating a broadcaster.
 * @server
 */
export interface BroadcasterOptions<Producers extends ProducerMap> {
	/**
	 * The map of producers to broadcast.
	 */
	readonly producers: Producers;

	/**
	 * The rate at which the server should hydrate the clients
	 * with the latest state. If this is set to `-1`, the server
	 * will not hydrate the clients.
	 * @default 60
	 */
	readonly hydrateRate?: number;

	/**
	 * The rate at which the server should broadcast actions to
	 * the clients. If this is set to `0`, actions are broadcast
	 * with the next server heartbeat.
	 * @default 0
	 */
	readonly dispatchRate?: number;

	/**
	 * Runs before actions are dispatched to a player. Can be used to
	 * filter actions or manipulate them before sending.
	 *
	 * Return `undefined` to not share the action with this player.
	 */
	readonly beforeDispatch?: (player: Player, action: BroadcastAction) => BroadcastAction | undefined;

	/**
	 * Runs before the client is hydrated with the latest state. Can be
	 * used to filter the state or hide certain values from the client.
	 *
	 * **Note:** Do not mutate the state in this function! Treat it as a
	 * read-only object, and return a new object if you need to change it.
	 */
	readonly beforeHydrate?: (player: Player, state: CombineStates<Producers>) => Partial<CombineStates<Producers>>;

	/**
	 * A function that broadcasts actions to the given player.
	 * @param player The player to broadcast to.
	 * @param actions The actions to broadcast.
	 */
	readonly dispatch: (player: Player, actions: BroadcastAction[]) => void;

	/**
	 * An optional custom hydration function. If provided, this function
	 * will be called instead of being implicitly handled in 'dispatch'.
	 * Useful for reducing load on a single remote if your state is large.
	 *
	 * **Note:** If defined, the client should call `receiver.hydrate` to
	 * hydrate the state.
	 *
	 * @param player The player to hydrate.
	 * @param state The state to hydrate the player with.
	 */
	readonly hydrate?: (player: Player, state: CombineStates<Producers>) => void;
}

/**
 * Options for creating a broadcast receiver.
 * @client
 */
export interface BroadcastReceiverOptions {
	/**
	 * A function that connects the player to the server broadcaster.
	 */
	readonly start: () => void;
}

/**
 * A broadcaster is used to broadcast actions to a set of players.
 * @server
 */
export interface Broadcaster {
	/**
	 * The middleware that should be applied to the server's root producer.
	 */
	readonly middleware: ProducerMiddleware;

	/**
	 * Marks the given player as ready to receive broadcasts.
	 */
	start(player: Player): void;
}

/**
 * A broadcast receiver is used to receive actions from the server and apply
 * them to the client's state.
 * @client
 */
export interface BroadcastReceiver<Producers extends ProducerMap> {
	/**
	 * The middleware that should be applied to the client's root producer.
	 */
	readonly middleware: ProducerMiddleware;

	/**
	 * Dispatches actions broadcasted by the server. This should only be called
	 * through a remote event.
	 * @param actions The actions to dispatch.
	 */
	dispatch(actions: BroadcastAction[]): void;

	/**
	 * Hydrates the client's state with the given state. This should only be
	 * called if a custom hydration function is provided in the broadcaster
	 * options.
	 * @param state The state to hydrate the client with.
	 */
	hydrate(state: CombineStates<Producers>): void;
}
