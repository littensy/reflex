--[=[
	A Producer is a state container that exposes a set of dispatchers that can
	be used to modify the state. The state is immmutable, so dispatchers return
	a new state object.
]=]
export type Producer<State = any, Dispatchers = { [string]: (...any) -> State }> = Dispatchers & {
	--[=[
		Returns the current state of the producer. Receives an optional selector
		function that can be used to select a subset of the state.
		@param selector An optional selector function that can be used to select
		a subset of the state.
		@return The current state of the producer.
	]=]
	getState: ((self: Producer<State, Dispatchers>) -> State)
		& (<Selection>(self: Producer<State, Dispatchers>, selector: (state: State) -> Selection) -> Selection),

	--[=[
		Sets the state of the producer to a shallow copy of the given state.
		Fires listeners on the next frame.
		@param state The new state of the producer.
	]=]
	setState: (self: Producer<State, Dispatchers>, state: State) -> (),

	--[=[
		Resets the state of the producer to the initial state. Fires listeners
		on the next frame if the state has changed.
	]=]
	resetState: (self: Producer<State, Dispatchers>) -> (),

	--[=[
		Returns the dispatchers for the actions passed to `createProducer`.
		@return A map of dispatchers.
	]=]
	getDispatchers: (self: Producer<State, Dispatchers>) -> Dispatchers,

	--[=[
		Returns the original action functions passed to `createProducer`.
		@return A map of action functions.
	]=]
	getActions: (self: Producer<State, Dispatchers>) -> {
		[string]: (state: State, ...any) -> any,
	},

	--[=[
		Flushes any pending updates by calling listeners immediately.
	]=]
	flush: (self: Producer<State, Dispatchers>) -> (),

	--[=[
		Subscribes to changes in a specific part of the state. State updates
		are deferred until the next frame after all state updates have been
		processed.
		@param selector A selector function that can be used to select a subset
		of the state.
		@param predicate An optional predicate function that must return `true`
		for the listener to be called.
		@param listener A callback that is called when the selected part of the
		state changes.
		@return A function that can be used to unsubscribe from the listener.
	]=]
	subscribe: ((self: Producer<State, Dispatchers>, listener: (state: State, prevState: State) -> ()) -> () -> ())
		& (<Selection>(
			self: Producer<State, Dispatchers>,
			selector: (state: State) -> Selection,
			listener: (state: Selection, prevState: Selection) -> ()
		) -> () -> ())
		& <Selection>(
			self: Producer<State, Dispatchers>,
			selector: (state: State) -> Selection,
			predicate: (state: Selection, prevState: Selection) -> boolean,
			listener: (state: Selection, prevState: Selection) -> ()
		) -> () -> (),

	--[=[
		Similar to `subscribe`, but the listener is disconnect after the first
		time it is called.
		@param selector A selector function that can be used to select a subset
		of the state.
		@param predicate An optional predicate function that must return `true`
		for the listener to be called.
		@param listener A callback that is called when the selected part of the
		state changes.
		@return A function that can be used to unsubscribe from the listener.
	]=]
	once: (<Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> ()) & <Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		predicate: ((state: Selection, prevState: Selection) -> boolean)?,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> (),

	--[=[
		Returns a Promise that resolves once a specific part of the state changes.
		Unsubscribes the listener if the Promise is cancelled or resolved.

		Receives an optional `predicate` function that must return `true` for the
		Promise to resolve for a given state change.

		@param selector A selector function that can be used to select a subset
		of the state.
		@param predicate An optional predicate function that must return `true`
		for the Promise to resolve for a given state change.
		@return A Promise that resolves once the selected part of the state changes.
	]=]
	wait: <Selection>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Selection)?,
		predicate: ((state: Selection, prevState: Selection) -> boolean)?
	) -> any,

	--[=[
		Tracks the addition and removal of items in an array. Calls the given
		observer for each added item and calls the cleanup function when the
		item is removed.

		If your array contains immutable objects, you can use the `discriminator`
		argument to return a unique identifier for each item. This allows the
		observer to avoid calling the observer for items that have already been
		added.

		@param selector The selector to track.
		@param discriminator Optional function that returns a unique identifier for
		each item. Useful when tracking immutable objects.
		@param observer The observer to call when an item is added. Returns a
		function that is called when the item is removed.
		@return An observer that calls the given observer for each added item and
		unsubscribes when the item is removed.
	]=]
	observe: (<K, V>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> { [K]: V },
		discriminator: ((item: V, index: K) -> unknown)?,
		observer: (item: V, index: K) -> (() -> ())?
	) -> () -> ()) & (<K, V>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> { [K]: V },
		observer: (item: V, index: K) -> (() -> ())?
	) -> () -> ()),

	--[=[
		Similar to `observe`, but it creates one observer while a selector or
		predicate is truthy, and destroys the observer when it's no longer truthy.
		@param selector The selector to track.
		@param predicate An optional predicate function that must return `true`
		for the observer to be created.
		@param observer The observer to call when the selector is truthy. Returns
		a function that is called when the selector is falsy.
		@return A cleanup function that removes all observers.
	]=]
	observeWhile: (<T>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> T,
		predicate: (state: T, prevState: T) -> boolean,
		observer: (state: T) -> (() -> ())?
	) -> () -> ()) & (<T>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> T?,
		observer: (state: T) -> (() -> ())?
	) -> () -> ()),

	--[=[
		Disconnects all listeners and cancels all pending flushes.
	]=]
	destroy: (self: Producer<State, Dispatchers>) -> (),

	--[=[
		Enhances the producer with new functionality. The enhancer function
		is passed to the producer as an argument and should mutate the producer
		in place.
		@deprecated Use `applyMiddleware` instead.
		@param enhancer A function that mutates the producer.
		@return The enhanced producer.
	]=]
	enhance: <Enhanced>(self: Producer<State, Dispatchers>, enhancer: (producer: any) -> Enhanced) -> Enhanced,

	--[=[
		Applies the given middlewares to the producer and its dispatchers. Returns
		the producer for chaining.

		Initially, a middleware is called once when it is applied to a producer.
		Next, the returned function is called on a dispatcher in the producer.
		The final function is called whenever the dispatcher is called.

		```lua
		local loggerMiddleware: Reflex.Middleware = function(producer)
			print("Initial state:", producer.getState())
			return function(dispatch, name)
				return function(...)
					print(`Dispatching {name}:`, ...args)
					return dispatch(...)
				end
			end
		end

		producer:applyMiddleware(loggerMiddleware)
		```

		@param middlewares A list of middleware to apply.
		@return The producer.
	]=]
	applyMiddleware: (
		self: Producer<State, Dispatchers>,
		...(producer: any) -> (dispatch: (...any) -> any, name: string) -> (...any) -> any
	) -> Producer<State, Dispatchers>,
}

--[=[
	A middleware is a function that is called before an action is dispatched.

	Initially, a middleware is called once when it is applied to a producer.
	Next, the returned function is called on a dispatcher in the producer.
	The final function is called whenever that dispatcher is called.
]=]
export type Middleware = (producer: Producer) -> (dispatch: (...any) -> any, name: string) -> (...any) -> any

export type ProducerMap = { [string]: Producer }

--[=[
	A container for storing a Reflex dispatcher's name and arguments.
]=]
export type BroadcastAction = {
	name: string,
	arguments: {},
}

--[=[
	Options for the broadcast middleware.
]=]
export type BroadcasterOptions = {
	--[=[
		The producers that will be tracked.
	]=]
	producers: ProducerMap,

	--[=[
		The function that will send the broadcasted actions to the given players.
	]=]
	broadcast: (actionsPerPlayer: { [Player]: { BroadcastAction } }) -> (),
}

--[=[
	Options for the broadcast receiver.
]=]
export type BroadcastReceiverOptions = {
	--[=[
		A function that should request the server's state through its broadcaster.
		This will be called when the middleware is applied to access the server's
		state.
		@return A Promise that resolves with the server's state.
	]=]
	requestState: () -> any,

	--[=[
		The interval at which the client should request the server's state. This
		is to help keep the state in sync if any remotes are missed. Defaults to
		`5` seconds.
	]=]
	requestInterval: number?,
}

--[=[
	A broadcaster that can be used to share actions with the client.
]=]
export type Broadcaster = {
	--[=[
		The middleware that will broadcast actions to the client.
	]=]
	middleware: Middleware,

	--[=[
		Gets the combined states of the producers in the provided map. This
		should be initiated by a player.
		@param player The player requesting the state.
		@return The combined state of the producers.
	]=]
	playerRequestedState: (self: Broadcaster, player: Player) -> any,
}

--[=[
	A receiver that can be used to dispatch actions broadcasted by the server.
]=]
export type BroadcastReceiver = {
	--[=[
		A middleware that should be applied to the root producer. This will
		merge the producer's state with the server's state on join.
	]=]
	middleware: Middleware,

	--[=[
		Dispatches actions broadcasted by the server.
		@param actions A list of action containers to dispatch.
	]=]
	dispatch: (self: BroadcastReceiver, actions: { BroadcastAction }) -> (),
}

return nil
