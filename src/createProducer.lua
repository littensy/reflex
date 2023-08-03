local Promise = require(script.Parent.Promise)
local types = require(script.Parent.types)

local function createProducer<State>(
	initialState: State,
	actions: { [string]: (state: State, ...any) -> any }
): types.Producer<State>
	local producer: types.Producer<State, { [string]: any }>
	local dispatchers = {}

	local currentListeners: { (State) -> () }? = {}
	local nextListeners = currentListeners :: { (State) -> () }
	local nextListenerId = 0

	local state = initialState
	local stateSinceLastFlush = initialState
	local pendingFlush: thread?

	local function ensureCanMutateNextListeners()
		if nextListeners == currentListeners then
			nextListeners = table.clone(currentListeners :: {})
		end
	end

	local function scheduleFlush()
		if pendingFlush then
			return
		end

		task.defer(function()
			pendingFlush = nil
			producer:flush()
		end)
	end

	local function subscribeInternal(listener: (state: State) -> ())
		local id = nextListenerId
		local connected = true

		ensureCanMutateNextListeners()
		nextListeners[id] = listener
		nextListenerId += 1

		return function()
			if connected then
				connected = false
				ensureCanMutateNextListeners()
				nextListeners[id] = nil
				currentListeners = nil
			end
		end
	end

	local function getState<Selection>(_, selector): State & Selection
		return if selector then selector(state) else state
	end

	local function setState(_, newState)
		state = newState
		scheduleFlush()
	end

	local function resetState()
		state = initialState
		scheduleFlush()
	end

	local function getDispatchers()
		return dispatchers
	end

	local function getActions()
		return actions
	end

	local function flush()
		if pendingFlush then
			task.cancel(pendingFlush)
			pendingFlush = nil
		end

		if state == stateSinceLastFlush then
			return
		end

		local currentState = state
		stateSinceLastFlush = state
		currentListeners = nextListeners

		for _, listener in currentListeners :: { (State) -> () } do
			task.spawn(listener, currentState)
		end
	end

	local function subscribe<T>(self, ...)
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

		return subscribeInternal(function(nextState)
			local nextSelection = if selector then selector(nextState) else nextState

			if selection == nextSelection then
				return
			end

			local prevSelection = selection
			selection = nextSelection

			if not predicate or predicate(nextSelection, prevSelection) then
				listener(nextSelection, prevSelection)
			end
		end)
	end

	local function once<T>(self, ...)
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

	local function wait<T>(self, selector, predicate)
		return Promise.new(function(resolve, _, onCancel)
			local unsubscribe = self:once(selector, predicate, function(state)
				resolve(state)
			end)

			onCancel(unsubscribe)
		end)
	end

	local function observe<T, U>(self, ...)
		local arguments = select("#", ...)
		local selector, discriminator, observer

		if arguments >= 3 then
			selector, discriminator, observer = ...
		else
			selector, observer = ...
		end

		local cleanupById = {}
		local selectDiffs = createDiffSelector(selector, discriminator)

		local function checkDiffs(diffs)
			for _, item in diffs.deletions do
				local index = diffs.keys[item]
				local id = if discriminator then discriminator(item, index) else item
				local cleanup = cleanupById[id]

				if cleanup then
					cleanupById[id] = nil
					cleanup()
				end
			end

			for _, item in diffs.additions do
				local index = diffs.keys[item]
				local id = if discriminator then discriminator(item, index) else item

				if not cleanupById[id] then
					cleanupById[id] = observer(item, index)
				end
			end
		end

		local unsubscribe = self:subscribe(selectDiffs, checkDiffs)

		checkDiffs(self:getState(selectDiffs))

		return function()
			unsubscribe()

			for _, cleanup in cleanupById do
				cleanup()
			end

			table.clear(cleanupById)
		end
	end

	local function observeWhile<T>(self, ...)
		local arguments = select("#", ...)
		local selector, predicate, observer

		if arguments >= 3 then
			selector, predicate, observer = ...
		else
			selector, observer = ...
		end

		local initialSelection = self:getState(selector)
		local cleanup

		local function updateObserver(selection, lastSelection)
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
			unsubscribe()

			if cleanup then
				cleanup()
			end
		end
	end

	local function enhance<T>(self, enhancer)
		return enhancer(self)
	end

	local function applyMiddleware(self, ...)
		return self:enhance(applyMiddlewareEnhancer(...))
	end

	local function destroy()
		if pendingFlush then
			task.cancel(pendingFlush)
			pendingFlush = nil
		end

		if currentListeners then
			table.clear(currentListeners)
		end

		table.clear(nextListeners)
	end

	local function compatConnect(self, listener)
		local unsubscribe = self:subscribe(listener)
		return {
			Connected = true,
			Disconnect = function(self)
				self.Connected = false
				unsubscribe()
			end,
		}
	end

	local function compatOnce(self, listener)
		local unsubscribe = self:once(listener)
		return {
			Connected = true,
			Disconnect = function(self)
				self.Connected = false
				unsubscribe()
			end,
		}
	end

	local function compatWait(self)
		return self:wait(function(state)
			return state
		end):expect()
	end

	producer = {
		getState = getState,
		setState = setState,
		resetState = resetState,
		getDispatchers = getDispatchers,
		getActions = getActions,
		flush = flush,
		subscribe = subscribe,
		once = once,
		wait = wait,
		observe = observe,
		observeWhile = observeWhile,
		enhance = enhance,
		applyMiddleware = applyMiddleware,
		destroy = destroy,
		-- Signal API compatibility
		Connect = compatConnect,
		Once = compatOnce,
		Wait = compatWait,
	}

	for name, action in actions do
		local function dispatch(...)
			state = action(state, ...)
			scheduleFlush()
			return state
		end

		dispatchers[name] = dispatch

		if not (producer :: {})[name] then
			(producer :: {})[name] = dispatch
		else
			warn(`Producer already has a property named {name}`)
		end
	end

	return producer
end
