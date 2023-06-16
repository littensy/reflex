local RunService = game:GetService("RunService")

local Promise = require(script.Parent.Promise)

--- A Producer is a state conainer that exposes a set of dispatchers that can
--- be used to modify the state. The state is immmutable, so dispatchers return
--- a new state object.
export type Producer<State, Dispatchers = { [string]: (...any) -> State }> = Dispatchers & {
	--- Returns the current state of the producer. Receives an optional selector
	--- function that can be used to select a subset of the state.
	--- @param selector An optional selector function that can be used to select
	--- a subset of the state.
	--- @return The current state of the producer.
	getState: ((self: Producer<State, Dispatchers>) -> State)
		& (<Selection>(self: Producer<State, Dispatchers>, selector: (state: State) -> Selection) -> Selection),

	--- Sets the state of the producer to a shallow copy of the given state.
	--- Fires listeners on the next frame.
	--- @param state The new state of the producer.
	--- @return The new state of the producer.
	setState: (self: Producer<State, Dispatchers>, state: State) -> (),

	--- Returns the dispatchers for the actions passed to `createProducer`.
	--- @return A map of dispatchers.
	getDispatchers: (self: Producer<State, Dispatchers>) -> Dispatchers,

	--- Flushes any pending updates by calling listeners immediately.
	flush: (self: Producer<State, Dispatchers>) -> (),

	--- Subscribes to changes in a specific part of the state. State updates
	--- are deferred until the next frame after all state updates have been
	--- processed.
	--- @param selector A selector function that can be used to select a subset
	--- of the state.
	--- @param listener A callback that is called when the selected part of the
	--- state changes.
	--- @return A function that can be used to unsubscribe from the listener.
	subscribe: (<Selection>(
		self: Producer<State, Dispatchers>,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> ()) & <Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> (),

	--- Similar to `subscribe`, but the listener is disconnect after the first
	--- time it is called.
	--- @param selector A selector function that can be used to select a subset
	--- of the state.
	--- @param listener A callback that is called when the selected part of the
	--- state changes.
	--- @return A function that can be used to unsubscribe from the listener.
	once: <Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> (),

	--- Returns a Promise that resolves once a specific part of the state changes.
	--- Unsubscribes the listener if the Promise is cancelled or resolved.
	---
	--- Receives an optional `predicate` function that must return `true` for the
	--- Promise to resolve for a given state change.
	---
	--- @param selector A selector function that can be used to select a subset
	--- of the state.
	--- @param predicate An optional predicate function that must return `true`
	--- for the Promise to resolve for a given state change.
	--- @return A Promise that resolves once the selected part of the state changes.
	wait: <Selection>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Selection)?,
		predicate: ((state: Selection, prevState: Selection) -> boolean)?
	) -> any,

	--- Disconnects all listeners and cancels all pending flushes.
	destroy: (self: Producer<State, Dispatchers>) -> (),

	--- Enhances the producer with new functionality. The enhancer function
	--- is passed to the producer as an argument and should mutate the producer
	--- in place.
	--- @param enhancer A function that mutates the producer.
	--- @return The enhanced producer.
	enhance: <Enhanced>(
		self: Producer<State, Dispatchers>,
		enhancer: (producer: Producer<State, Dispatchers>) -> Enhanced
	) -> Enhanced,

	--- Returns the original action functions passed to `createProducer`.
	--- @return A map of action functions.
	getActions: (self: Producer<State, Dispatchers>) -> {
		[string]: (state: State, ...any) -> any,
	},
}

--- Creates a producer that can be used to manage state.
---
--- A producer is a state container that exposes a set of dispatchers that can
--- be used to modify the state. The state is immutable, so the dispatchers
--- return a new state object.
---
--- The dispatchers are also exposed as callbacks in the producer, and are based
--- on the actions parameter, but with the first argument omitted.
---
--- @param initialState The initial state of the producer.
--- @param actions A set of actions that can be used to modify the state.
--- @return A producer that can be used to manage state.
local function createProducer<State>(
	initialState: State,
	actions: { [string]: (state: State, ...any) -> any }
): Producer<State>
	local producer = {} :: Producer<State>

	local dispatchers = {}
	local currentListeners: {}? = {}
	local nextListeners = currentListeners :: {}
	local listenerIdCounter = 0

	local state = initialState
	local stateSinceLastFlush = initialState
	local pendingFlush: RBXScriptConnection?

	local function ensureCanMutateNextListeners()
		if nextListeners == currentListeners then
			nextListeners = table.clone(currentListeners :: {})
		end
	end

	local function scheduleFlush()
		if not pendingFlush then
			pendingFlush = RunService.Heartbeat:Once(function()
				pendingFlush = nil
				producer:flush()
			end)
		end
	end

	local function subscribe(id: number, listener: () -> ())
		local connected = false
		ensureCanMutateNextListeners()
		nextListeners[id] = listener

		return function()
			if connected then
				connected = false
				ensureCanMutateNextListeners()
				nextListeners[id] = nil
				currentListeners = nil
			end
		end
	end

	function producer:getState(selector)
		return if selector then selector(state) else state
	end

	function producer:setState(newState)
		state = newState
		scheduleFlush()
	end

	function producer:getDispatchers()
		return dispatchers
	end

	function producer:getActions()
		return actions
	end

	function producer:flush()
		if pendingFlush then
			pendingFlush:Disconnect()
			pendingFlush = nil
		end

		if state == stateSinceLastFlush then
			return
		end

		stateSinceLastFlush = state
		currentListeners = nextListeners

		for _, listener in currentListeners :: {} do
			listener(state)
		end
	end

	function producer:subscribe(selectorOrListener, listenerOrUndefined)
		local selector, listener = selectorOrListener, listenerOrUndefined

		if not listener then
			selector = nil
			listener = selectorOrListener
		end

		local state = self:getState(selector)
		local id = listenerIdCounter
		listenerIdCounter += 1

		return subscribe(id, function()
			local nextState = self:getState(selector)
			if state ~= nextState then
				local prevState = state
				state = nextState
				listener(state, prevState)
			end
		end)
	end

	function producer:once(selector, listener)
		local unsubscribe
		unsubscribe = self:subscribe(selector, function(state, prevState)
			unsubscribe()
			listener(state, prevState)
		end)
		return unsubscribe
	end

	function producer:wait(selector, predicate)
		selector = selector or function(state)
			return state
		end

		predicate = predicate or function()
			return true
		end

		return Promise.new(function(resolve, _, onCancel)
			local unsubscribe
			unsubscribe = self:subscribe(selector, function(state, prevState)
				if predicate(state, prevState) then
					unsubscribe()
					resolve(state)
				end
			end)

			onCancel(unsubscribe)
		end)
	end

	function producer:destroy()
		if pendingFlush then
			pendingFlush:Disconnect()
			pendingFlush = nil
		end

		if currentListeners then
			table.clear(currentListeners)
		end

		table.clear(nextListeners)
	end

	function producer:enhance(enhancer)
		return enhancer(self)
	end

	-- Support for APIs that require signal-like objects

	function producer:Connect(listener)
		local unsubscribe = self:subscribe(listener)
		return {
			Connected = true,
			Disconnect = function(self)
				self.Connected = false
				unsubscribe()
			end,
		}
	end

	function producer:Once(listener)
		local unsubscribe = self:once(listener)
		return {
			Connected = true,
			Disconnect = function(self)
				self.Connected = false
				unsubscribe()
			end,
		}
	end

	function producer:Wait()
		return self:wait(function(state)
			return state
		end):expect()
	end

	-- Populate the producer and dispatchers table
	for name, action in actions do
		local function dispatch(...)
			state = action(state, ...)
			scheduleFlush()
			return state
		end

		dispatchers[name] = dispatch

		if not producer[name] then
			producer[name] = dispatch
		else
			warn(`Producer already has a property named {name}`)
		end
	end

	return producer
end

return createProducer
