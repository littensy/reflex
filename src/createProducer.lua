local Promise = require(script.Parent.Promise)
local types = require(script.Parent.types)
local applyMiddleware = require(script.Parent.applyMiddleware)
local createChangeSelector = require(script.Parent.utils.createChangeSelector)
local logger = require(script.Parent.utils.logger)

local WARN_BAD_SELECTOR = [[
Reflex detected a selector function that returns conflicting values for the same input!
This is likely caused by one of the following:

- The selector function is not memoized and should use 'createSelector'
- The selector result is inconsistent between calls

Learn more about writing selectors here:
https://littensy.github.io/reflex/docs/guides/using-selectors
]]

local function createProducer<State>(
	initialState: State,
	actions: { [string]: (state: State, ...any) -> State }
): types.Producer<State>
	local producer = {}
	local dispatchers = {}

	local currentListeners: { (State) -> () }? = {}
	local nextListeners = currentListeners :: { (State) -> () }
	local nextListenerId = 0

	local state = initialState
	local stateSinceLastFlush = initialState
	local pendingFlush: thread?

	local function flush()
		if pendingFlush then
			task.cancel(pendingFlush)
			pendingFlush = nil
		end

		if state == stateSinceLastFlush then
			return
		end

		stateSinceLastFlush = state
		currentListeners = nextListeners

		for _, listener in currentListeners :: { (State) -> () } do
			task.spawn(listener, stateSinceLastFlush)
		end
	end

	local function scheduleFlush()
		if pendingFlush then
			return
		end

		task.defer(function()
			pendingFlush = nil
			flush()
		end)
	end

	-- This allows us to mutate nextListeners while iterating over
	-- currentListeners. By the end of the iteration, any changes made
	-- will be applied to a copy of currentListeners.
	local function ensureCanMutateNextListeners()
		if currentListeners == nextListeners then
			nextListeners = table.clone(currentListeners :: {})
		end
	end

	local function subscribe(listener: (state: State) -> ())
		local id = nextListenerId
		local connected = true

		ensureCanMutateNextListeners()
		nextListeners[id] = listener
		nextListenerId += 1

		return function()
			if not connected then
				return
			end

			connected = false
			ensureCanMutateNextListeners()
			nextListeners[id] = nil

			-- A reference to this listener may still be held by currentListeners,
			-- so we should set it to nil to prevent a memory leak. This is okay
			-- because it is set back to nextListeners before the next iteration.
			currentListeners = nil
		end
	end

	function producer.getState<Result>(self: types.Producer<State>, selector: ((state: State) -> Result)?): State & Result
		return (if selector then selector(state) else state) :: State & Result
	end

	function producer.setState(self: types.Producer<State>, newState: State)
		state = newState
		scheduleFlush()
	end

	function producer.resetState(self: types.Producer<State>)
		state = initialState
		scheduleFlush()
	end

	function producer.getDispatchers(self: types.Producer<State>)
		return dispatchers
	end

	function producer.getActions(self: types.Producer<State>)
		return actions
	end

	function producer.flush(self: types.Producer<State>)
		flush()
	end

	function producer.subscribe<Result>(self: types.Producer<State>, ...: any): types.Cleanup
		local selector: ((state: State) -> Result)?
		local predicate: ((current: State | Result, previous: State | Result) -> boolean)?
		local listener: (current: State | Result, previous: State | Result) -> ()

		if select("#", ...) >= 3 then
			selector, predicate, listener = ...
		elseif select("#", ...) == 2 then
			selector, listener = ...
		else
			listener = ...
		end

		local currentResult = if selector then selector(state) else state

		if selector and selector(state) ~= currentResult then
			-- Emit a warning if the selector function returns conflicting values
			-- for the same input. This is likely caused by un-memoized selectors
			-- or inconsistent selector results.
			logger.warn(WARN_BAD_SELECTOR .. "\n" .. debug.traceback("Function traceback", 2))
		end

		return subscribe(function(nextState)
			local nextResult = if selector then selector(nextState) else nextState

			if currentResult == nextResult then
				return
			end

			if not predicate or predicate(nextResult, currentResult) then
				local previousResult = currentResult
				currentResult = nextResult
				listener(nextResult, previousResult)
			end
		end)
	end

	function producer.once<Result>(self: types.Producer<State>, ...: any): types.Cleanup
		local selector: ((state: State) -> Result)?
		local predicate: ((current: State | Result, previous: State | Result) -> boolean)?
		local listener: (current: State | Result, previous: State | Result) -> ()

		if select("#", ...) >= 3 then
			selector, predicate, listener = ...
		elseif select("#", ...) == 2 then
			selector, listener = ...
		else
			listener = ...
		end

		local unsubscribe

		unsubscribe = self:subscribe(selector, predicate, function(current, previous)
			unsubscribe()
			listener(current, previous)
		end)

		return unsubscribe
	end

	function producer.wait<Result>(
		self: types.Producer<State>,
		selector: (state: State) -> Result,
		predicate: ((current: Result, previous: Result) -> boolean)?
	): Promise.Promise<Result>
		return Promise.new(function(resolve: (Result) -> (), reject, onCancel)
			local unsubscribe = self:once(selector, predicate, function(state)
				resolve(state)
			end)

			onCancel(unsubscribe)
		end)
	end

	function producer.observe<K, V>(self: types.Producer<State>, ...: any): types.Cleanup
		local selector: (state: State) -> { [K]: V }
		local discriminator: ((item: V, index: K) -> unknown)?
		local observer: (item: V, index: K) -> types.Cleanup?

		if select("#", ...) >= 3 then
			selector, discriminator, observer = ...
		else
			selector, observer = ...
		end

		local selectChanges = createChangeSelector(selector, discriminator)
		local cleanupFunctions: { [unknown]: types.Cleanup? } = {}

		local function identify(item: V, index: K): unknown
			return if discriminator then discriminator(item, index) else item
		end

		local function onChange(changes)
			for _, item in changes.deletions do
				local index = changes.keys[item]
				local id = identify(item, index)
				local cleanup = cleanupFunctions[id]

				if cleanup then
					cleanupFunctions[id] = nil
					cleanup()
				end
			end

			for _, item in changes.additions do
				local index = changes.keys[item]
				local id = identify(item, index)

				if not cleanupFunctions[id] then
					cleanupFunctions[id] = observer(item, index)
				end
			end
		end

		local unsubscribe = self:subscribe(selectChanges, onChange)

		onChange(selectChanges(state))

		return function()
			unsubscribe()

			for _, cleanup in cleanupFunctions do
				(cleanup :: types.Cleanup)()
			end

			table.clear(cleanupFunctions)
		end
	end

	function producer.observeWhile<T>(self: types.Producer<State>, ...: any): types.Cleanup
		local selector: (state: State) -> T
		local predicate: ((current: T, previous: T) -> boolean)?
		local observer: (state: T) -> types.Cleanup?

		if select("#", ...) >= 3 then
			selector, predicate, observer = ...
		else
			selector, observer = ...
		end

		local cleanup: types.Cleanup?

		local function onChange(current, previous)
			local shouldObserve = if predicate then predicate(current, previous) else current

			if shouldObserve and not cleanup then
				cleanup = observer(current)
			elseif not shouldObserve and cleanup then
				cleanup()
				cleanup = nil
			end
		end

		local unsubscribe = self:subscribe(selector, onChange)

		onChange(selector(state), selector(state))

		return function()
			unsubscribe()

			if cleanup then
				cleanup()
			end
		end
	end

	function producer.enhance<Enhanced>(self: types.Producer<State>, enhancer: (any) -> Enhanced): Enhanced
		return enhancer(self)
	end

	function producer.applyMiddleware(self: types.Producer<State>, ...: types.Middleware): types.Producer<State>
		return self:enhance(applyMiddleware(...))
	end

	function producer.destroy(self: types.Producer<State>)
		if pendingFlush then
			task.cancel(pendingFlush)
			pendingFlush = nil
		end

		currentListeners = nil
		table.clear(nextListeners)
	end

	function producer.Connect(self: types.Producer<State>, listener: (state: State) -> ()): RBXScriptConnection
		local unsubscribe = self:subscribe(listener)

		return {
			Connected = true,
			Disconnect = function(self)
				self.Connected = false
				unsubscribe()
			end,
		} :: any
	end

	function producer.Once(self: types.Producer<State>, listener: (state: State) -> ()): RBXScriptConnection
		local unsubscribe = self:once(listener)

		return {
			Connected = true,
			Disconnect = function(self)
				self.Connected = false
				unsubscribe()
			end,
		} :: any
	end

	function producer.Wait(self: types.Producer<State>): State
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
