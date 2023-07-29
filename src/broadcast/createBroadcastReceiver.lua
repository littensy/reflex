local types = require(script.Parent.Parent.types)
local hydrate = require(script.Parent.hydrate)

--[=[
	Creates a broadcast receiver object that can be used to dispatch actions
	broadcasted by the server.
	@param options The options for the broadcast receiver.
	@return The broadcast receiver.
]=]
local function createBroadcastReceiver(options: types.BroadcastReceiverOptions): types.BroadcastReceiver
	local receiver = {} :: types.BroadcastReceiver
	local producer: types.Producer?

	local function hydrateState(serverState: { [string]: any })
		assert(producer, "Cannot use broadcast receiver before the middleware is applied.")

		local nextState = table.clone(producer:getState())

		for key, value in serverState do
			nextState[key] = value
		end

		producer:setState(nextState)
	end

	function receiver:dispatch(actions: { types.BroadcastAction })
		assert(producer, "Cannot dispatch actions before the middleware is applied")

		local dispatchers = producer:getDispatchers()

		for _, action in actions do
			local dispatcher = dispatchers[action.name]

			if dispatcher then
				dispatcher(table.unpack(action.arguments))
			elseif hydrate.isHydrate(action) then
				hydrateState(action.arguments[1])
			end
		end
	end

	function receiver:hydrate(serverState: { [string]: any })
		hydrateState(serverState)
	end

	function receiver.middleware(currentProducer)
		producer = currentProducer

		options.start()

		return function(dispatch)
			return dispatch
		end
	end

	return receiver
end

return createBroadcastReceiver
