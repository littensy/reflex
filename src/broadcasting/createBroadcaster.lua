local Players = game:GetService("Players")

local types = require(script.Parent.Parent.types)
local setInterval = require(script.Parent.Parent.utils.setInterval)
local hydration = require(script.Parent.hydration)

local function createBroadcaster(options: types.BroadcasterOptions): types.Broadcaster
	local broadcaster: types.Broadcaster
	local producer: types.Producer?

	local pendingActionsByPlayer: { [Player]: { types.BroadcastAction } } = {}
	local globalActionSet: { [string]: boolean } = {}
	local shouldFlush = false

	for _, slice in options.producers do
		for name in slice:getDispatchers() do
			globalActionSet[name] = true
		end
	end

	local function getGlobalState()
		assert(producer, "Cannot use a broadcaster before the middleware is applied.")

		local currentState = producer:getState()
		local globalState = {}

		for name in globalActionSet do
			globalState[name] = currentState[name]
		end

		return globalState
	end

	-- Actions are stored in a pending queue for each player. This is because
	-- it's possible for a player to be hydrated before the broadcaster can
	-- flush its actions.
	local function pendActionOnDispatch(name: string, ...: unknown)
		for player, queue in pendingActionsByPlayer do
			local action: types.BroadcastAction = {
				name = name,
				arguments = { ... },
			}

			if options.beforeDispatch then
				local newAction = options.beforeDispatch(player, action)

				if newAction then
					action = newAction
				else
					return
				end
			end

			table.insert(queue, action)
		end
	end

	local function hydratePlayer(player: Player)
		if pendingActionsByPlayer[player] then
			-- If the player has pending actions, they become obsolete since
			-- hydration will override them anyway.
			pendingActionsByPlayer[player] = {}
		end

		local globalState = getGlobalState()

		if options.beforeHydrate then
			globalState = options.beforeHydrate(player, globalState)
		end

		if options.hydrate then
			options.hydrate(player, globalState)
		else
			options.dispatch(player, hydration.createHydratePayload(globalState))
		end
	end

	local function init()
		local hydrateHandle = setInterval(function()
			for player in pendingActionsByPlayer do
				hydratePlayer(player)
			end
		end, options.hydrateRate or 60)

		local flushHandle = setInterval(function()
			broadcaster:flush()
		end, options.dispatchRate or 0)

		local playerRemoving = Players.PlayerRemoving:Connect(function(player)
			pendingActionsByPlayer[player] = nil
		end)

		return function()
			hydrateHandle()
			flushHandle()
			playerRemoving:disconnect()
		end
	end

	local function flush(self: types.Broadcaster)
		if not shouldFlush then
			return
		end

		shouldFlush = false

		for player, actions in pendingActionsByPlayer do
			local empty = next(actions) == nil

			if not empty then
				options.dispatch(player, actions)
				pendingActionsByPlayer[player] = {}
			end
		end
	end

	local function start(self: types.Broadcaster, player: Player)
		if not pendingActionsByPlayer[player] then
			hydratePlayer(player)
		end
	end

	local middleware: types.Middleware = function(currentProducer)
		producer = currentProducer

		return function(nextDispatch, name)
			if not globalActionSet[name] then
				return nextDispatch
			end

			return function(...)
				pendActionOnDispatch(name, ...)
				shouldFlush = true
				return nextDispatch(...)
			end
		end
	end

	broadcaster = {
		flush = flush,
		start = start,
		middleware = middleware,
		destroy = init(),
	}

	return broadcaster
end

return createBroadcaster
