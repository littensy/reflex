local Players = game:GetService("Players")

local types = require(script.Parent.Parent.types)
local setInterval = require(script.Parent.Parent.utils.setInterval)
local hydrate = require(script.Parent.hydrate)

--[=[
	Creates a broadcaster that can be used to share actions with the client.
	It will track all actions that are dispatched by the provided producers and
	will broadcast them to the client.
	@param options The options for the broadcaster.
	@return The broadcaster.
]=]
local function createBroadcaster(options: types.BroadcasterOptions): types.Broadcaster
	local broadcaster = {} :: types.Broadcaster
	local producer: types.Producer?

	local pendingDispatch = false
	local pendingActionsByPlayer: { [Player]: { types.BroadcastAction } } = {}
	local actionFilter: { [string]: boolean } = {}

	for _, slice in options.producers do
		for name in slice:getDispatchers() do
			actionFilter[name] = true
		end
	end

	local function getSharedState()
		assert(producer, "Cannot use broadcaster before the middleware is applied.")

		local sharedState = {}
		local serverState = producer.getState()

		for name in options.producers do
			sharedState[name] = serverState[name]
		end

		return sharedState
	end

	local function hydratePlayer(player: Player)
		local state = getSharedState()

		if options.beforeHydrate then
			state = options.beforeHydrate(player, state)
		end

		if options.hydrate then
			options.hydrate(player, state)
		else
			options.dispatch(player, { hydrate.createHydrateAction(state) })
		end
	end

	local hydrateInterval = setInterval(function()
		for player in pendingActionsByPlayer do
			hydratePlayer(player)
		end
	end, options.hydrateRate or 60)

	local dispatchInterval = setInterval(function()
		broadcaster:flush()
	end, options.dispatchRate or 0)

	local playerRemoving = Players.PlayerRemoving:Connect(function(player)
		pendingActionsByPlayer[player] = nil
	end)

	function broadcaster:destroy()
		hydrateInterval()
		dispatchInterval()
		playerRemoving:Disconnect()
	end

	function broadcaster:flush()
		if not pendingDispatch then
			return
		end

		pendingDispatch = false

		for player, pendingActions in pendingActionsByPlayer do
			options.dispatch(player, pendingActions)
			pendingActionsByPlayer[player] = {}
		end
	end

	function broadcaster:start(player)
		if not pendingActionsByPlayer[player] then
			pendingActionsByPlayer[player] = {}
			hydratePlayer(player)
		end
	end

	broadcaster.middleware = function(currentProducer)
		producer = currentProducer

		return function(dispatch, name)
			if not actionFilter[name] then
				return dispatch
			end

			return function(...)
				for player, pendingActions in pendingActionsByPlayer do
					local action: types.BroadcastAction? = {
						name = name,
						arguments = { ... },
					}

					if options.beforeDispatch then
						action = options.beforeDispatch(player, action :: types.BroadcastAction)
					end

					table.insert(pendingActions, action)
				end

				pendingDispatch = true

				return dispatch(...)
			end
		end
	end

	return broadcaster
end

return createBroadcaster
