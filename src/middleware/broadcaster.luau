local RunService = game:GetService("RunService")
local Players = game:GetService("Players")

local createProducer = require(script.Parent.Parent.createProducer)
local applyMiddleware = require(script.Parent.Parent.applyMiddleware)

type ProducerMap = { [string]: createProducer.Producer<any> }

--- A container for storing a Reflex dispatcher's name and arguments.
export type BroadcastAction = {
	name: string,
	arguments: {},
}

--- Options for the broadcast middleware.
export type BroadcasterOptions<T = ProducerMap> = {
	--- The producers that will be tracked.
	producers: { [unknown]: T },

	--- The function that will send the broadcasted actions to the given players.
	broadcast: (players: { Player }, actions: { BroadcastAction }) -> (),
}

--- A broadcaster that can be used to share actions with the client.
export type Broadcaster<T = ProducerMap> = {
	--- The middleware that will broadcast actions to the client.
	middleware: applyMiddleware.Middleware,

	--- Gets the combined states of the producers in the provided map. This
	--- should only be called once per player and be initiated by the player.
	--- @param player The player requesting the state.
	--- @return The combined state of the producers.
	--- @throws If this is called for a player that has already requested the state.
	playerRequestedState: (player: Player) -> {},
}

--- Creates a broadcaster that can be used to share actions with the client.
--- It will track all actions that are dispatched by the provided producers and
--- will broadcast them to the client.
--- @param options The options for the broadcaster.
--- @return The broadcaster.
local function createBroadcaster<T>(options: BroadcasterOptions<T>): Broadcaster<T>
	local producers = options.producers
	local broadcast = options.broadcast

	local players: { Player } = {}
	local pendingActions: { BroadcastAction } = {}
	local actionFilter: { [string]: boolean } = {}

	local rootProducer: createProducer.Producer<any>?
	local pendingBroadcast: RBXScriptConnection?

	for _, producer in producers do
		for name in producer:getDispatchers() do
			actionFilter[name] = true
		end
	end

	local function playerRequestedState(player: Player)
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

	local function scheduleBroadcast()
		if pendingBroadcast then
			return
		end

		pendingBroadcast = RunService.Heartbeat:Once(function()
			pendingBroadcast = nil
			broadcast(players, pendingActions)
			pendingActions = {}
		end)
	end

	local middleware: applyMiddleware.Middleware = function(dispatch, resolve, producer)
		rootProducer = producer

		return function(...)
			local name = resolve()
			local state = dispatch(...)

			if not actionFilter[name] then
				return state
			end

			table.insert(pendingActions, {
				name = name,
				arguments = { ... },
			})

			scheduleBroadcast()

			return state
		end
	end

	Players.PlayerRemoving:Connect(function(player)
		table.remove(players, table.find(players, player) or -1)
	end)

	return {
		middleware = middleware,
		playerRequestedState = playerRequestedState,
	}
end

return createBroadcaster
