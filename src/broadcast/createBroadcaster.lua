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

	local players: { Player } = {}
	local pendingActions: { types.BroadcastAction } = {}
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

		broadcast(players, pendingActions)
		pendingActions = {}
	end

	function broadcaster:playerRequestedState(player: Player)
		assert(not table.find(players, player), `Player {player} has already requested state.`)
		assert(rootProducer, "Cannot call playerRequestedState before middleware is applied.")

		table.insert(players, player)

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
				table.insert(pendingActions, {
					name = name,
					arguments = { ... },
				})

				scheduleBroadcast()

				return dispatch(...)
			end
		end
	end

	Players.PlayerRemoving:Connect(function(player)
		table.remove(players, table.find(players, player) or -1)
	end)

	return broadcaster
end

return createBroadcaster
