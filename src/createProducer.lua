local RunService = game:GetService("RunService")

local Promise = require(script.Parent.Promise)
local types = require(script.Parent.types)
local applyMiddleware = require(script.Parent.applyMiddleware)
local createSelectArrayDiffs = require(script.Parent.utils.createSelectArrayDiffs)
local testSelector = require(script.Parent.utils.testSelector)

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

	function producer:resetState()
		state = initialState
		scheduleFlush()
	end

	function producer:getDispatchers()
		return dispatchers
	end

	function producer:getActions()
		return actions
	end

	function producer:clone()
		return createProducer(state, actions)
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

	function producer:subscribe(...)
		local arguments = select("#", ...)
		local selector, predicate, listener

		if arguments >= 3 then
			selector, predicate, listener = ...
		elseif arguments == 2 then
			selector, listener = ...
		else
			listener = ...
		end

		local selection = self:getState(selector)

		if selector then
			testSelector(selector, selection, state)
		end

		return subscribe(function(nextState)
			local nextSelection = if selector then selector(nextState) else nextState

			if selection == nextSelection then
				return
			end

			local prevSelection = selection
			selection = nextSelection

			if predicate and not predicate(nextSelection, prevSelection) then
				return
			end

			listener(nextSelection, prevSelection)
		end)
	end

	function producer:once(...)
		local arguments = select("#", ...)
		local selector, predicate, listener

		if arguments >= 3 then
			selector, predicate, listener = ...
		elseif arguments == 2 then
			selector, listener = ...
		else
			listener = ...
		end

		local unsubscribe
		unsubscribe = self:subscribe(selector, predicate, function(state, prevState)
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

	function producer:observe(...)
		local arguments = select("#", ...)
		local selector, discriminator, observer

		if arguments >= 3 then
			selector, discriminator, observer = ...
		else
			selector, observer = ...
		end

		local idToCleanup = {}
		local selectDiffs = createSelectArrayDiffs(selector, discriminator)
		local connected = true

		local function checkDiffs(diffs)
			if not connected then
				return
			end

			for _, entry in diffs.deletions do
				local cleanup = idToCleanup[entry.id]

				if cleanup then
					idToCleanup[entry.id] = nil
					cleanup()
				end
			end

			for _, entry in diffs.additions do
				if not idToCleanup[entry.id] then
					idToCleanup[entry.id] = observer(entry.value, entry.key)
				end
			end
		end

		local unsubscribe = self:subscribe(selectDiffs, checkDiffs)

		checkDiffs(self:getState(selectDiffs))

		return function()
			connected = false
			unsubscribe()

			for _, cleanup in idToCleanup do
				cleanup()
			end

			table.clear(idToCleanup)
		end
	end

	function producer:observeWhile(...)
		local arguments = select("#", ...)
		local selector, predicate, observer

		if arguments >= 3 then
			selector, predicate, observer = ...
		else
			selector, observer = ...
		end

		local initialSelection = self:getState(selector)
		local connected = true
		local cleanup

		local function updateObserver(selection, lastSelection)
			if not connected then
				return
			end

			local shouldObserve = if predicate then predicate(selection, lastSelection) else selection

			if shouldObserve and not cleanup then
				cleanup = observer(selection)
			elseif not shouldObserve and cleanup then
				task.spawn(cleanup)
				cleanup = nil
			end
		end

		local unsubscribe = self:subscribe(selector, updateObserver)

		updateObserver(initialSelection, initialSelection)

		return function()
			connected = false
			unsubscribe()

			if cleanup then
				cleanup()
			end
		end
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
