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

	local pendingActionsByPlayer: { [Player]: { types.BroadcastAction } } = {}
	local actionFilter: { [string]: boolean } = {}

	local producer: types.Producer?
	local pendingDispatch: thread?

	for _, slice in options.producers do
		for name in slice:getDispatchers() do
			actionFilter[name] = true
		end
	end

	local function scheduleDispatch()
		if pendingDispatch then
			return
		end

		pendingDispatch = task.defer(function()
			pendingDispatch = nil
			broadcaster:flush()
		end)
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
		options.dispatch(player, { hydrate.createHydrateAction(getSharedState()) })
	end

	function broadcaster:flush()
		if pendingDispatch then
			task.cancel(pendingDispatch)
			pendingDispatch = nil
		end

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
				local action = { name = name, arguments = { ... } }

				for _, pendingActions in pendingActionsByPlayer do
					table.insert(pendingActions, action)
				end

				scheduleDispatch()

				return dispatch(...)
			end
		end
	end

	Players.PlayerRemoving:Connect(function(player)
		pendingActionsByPlayer[player] = nil
	end)

	setInterval(function()
		for player in pendingActionsByPlayer do
			hydratePlayer(player)
		end
	end, options.hydrateRate or 60)

	return broadcaster
end

return createBroadcaster
