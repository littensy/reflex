local RunService = game:GetService("RunService")

local Promise = require(script.Parent.Promise)
local types = require(script.Parent.types)
local applyMiddleware = require(script.Parent.applyMiddleware)

--[=[
	Creates a producer that can be used to manage state.

	A producer is a state container that exposes a set of dispatchers that can
	be used to modify the state. The state is immutable, so the dispatchers
	return a new state object.

	The dispatchers are also exposed as callbacks in the producer, and are based
	on the actions parameter, but with the first argument omitted.

	@param initialState The initial state of the producer.
	@param actions A set of actions that can be used to modify the state.
	@return A producer that can be used to manage state.
]=]
local function createProducer<State>(
	initialState: State,
	actions: { [string]: (state: State, ...any) -> any }
): types.Producer<State>
	local producer = {} :: types.Producer<State>

	local dispatchers = {}
	local currentListeners: {}? = {}
	local nextListeners = currentListeners :: {}
	local listenerIdCounter = 1

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

	local function subscribe(listener: (state: State) -> ())
		local connected = true

		local id = listenerIdCounter
		listenerIdCounter += 1

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

		local currentState = state

		for _, listener in currentListeners :: {} do
			task.spawn(listener, currentState)
		end
	end

	function producer:subscribe(selectorOrListener, listenerOrNil)
		local selector, listener = selectorOrListener, listenerOrNil

		if not listener then
			selector = nil
			listener = selectorOrListener
		end

		local state = self:getState(selector)

		return subscribe(function(current)
			local nextState = if selector then selector(current) else current

			if state ~= nextState then
				local prevState = state
				state = nextState
				listener(state, prevState)
			end
		end)
	end

	function producer:once(selector, predicateOrListener, listenerOrNil)
		local predicate, listener = predicateOrListener, listenerOrNil

		if not listener then
			predicate = nil
			listener = predicateOrListener
		end

		local unsubscribe
		unsubscribe = self:subscribe(selector, function(state, prevState)
			if predicate and not predicate(state, prevState) then
				return
			end

			unsubscribe()
			listener(state, prevState)
		end)

		return unsubscribe
	end

	function producer:wait(selector, predicate)
		return Promise.new(function(resolve, _, onCancel)
			local unsubscribe = self:once(selector, predicate, function(state)
				resolve(state)
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

	function producer:applyMiddleware(...)
		return self:enhance(applyMiddleware(...))
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
