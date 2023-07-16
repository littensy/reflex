local RunService = game:GetService("RunService")
local Players = game:GetService("Players")

local types = require(script.Parent.Parent.types)

--[=[
	Creates a broadcaster that can be used to share actions with the client.
	It will track all actions that are dispatched by the provided producers and
	will broadcast them to the client.
	@param options The options for the broadcaster.
	@return The broadcaster.
]=]
local function createBroadcaster(options: types.BroadcasterOptions): types.Broadcaster
	local producers = options.producers
	local broadcast = options.broadcast

	local broadcaster = {} :: types.Broadcaster

	local pendingActionsByPlayer: { [Player]: { types.BroadcastAction } } = {}
	local actionFilter: { [string]: boolean } = {}

	local rootProducer: types.Producer?
	local pendingBroadcast: RBXScriptConnection?

	for _, producer in producers do
		for name in producer:getDispatchers() do
			actionFilter[name] = true
		end
	end

	local function scheduleBroadcast()
		if pendingBroadcast then
			return
		end

		pendingBroadcast = RunService.Heartbeat:Once(function()
			pendingBroadcast = nil
			broadcaster:flush()
		end)
	end

	function broadcaster:flush()
		if pendingBroadcast then
			pendingBroadcast:Disconnect()
			pendingBroadcast = nil
		end

		local newPendingActionsByPlayer = {}

		for player, pendingActions in pendingActionsByPlayer do
			newPendingActionsByPlayer[player] = {}
		end

		broadcast(pendingActionsByPlayer)
		pendingActionsByPlayer = newPendingActionsByPlayer
	end

	function broadcaster:playerRequestedState(player: Player)
		assert(rootProducer, "Cannot call playerRequestedState before middleware is applied.")

		-- Reset the pending actions to prevent the client from receiving
		-- actions that have already dispatched, but have not been broadcasted.
		pendingActionsByPlayer[player] = {}

		local state = {}
		local rootState = rootProducer.getState()

		for name in producers do
			state[name] = rootState[name]
		end

		return state
	end

	function broadcaster.middleware(producer)
		rootProducer = producer

		return function(dispatch, name)
			if not actionFilter[name] then
				return dispatch
			end

			return function(...)
				for _, pendingActions in pendingActionsByPlayer do
					table.insert(pendingActions, {
						name = name,
						arguments = { ... },
					})
				end

				scheduleBroadcast()

				return dispatch(...)
			end
		end
	end

	Players.PlayerRemoving:Connect(function(player)
		pendingActionsByPlayer[player] = nil
	end)

	return broadcaster
end

return createBroadcaster
