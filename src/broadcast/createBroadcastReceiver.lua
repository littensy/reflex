local types = require(script.Parent.Parent.types)

--[=[
	Creates a broadcast receiver object that can be used to dispatch actions
	broadcasted by the server.
	@param options The options for the broadcast receiver.
	@return The broadcast receiver.
]=]
local function createBroadcastReceiver(options: types.BroadcastReceiverOptions): types.BroadcastReceiver
	local requestState = options.requestState
	local receiver = {} :: types.BroadcastReceiver
	local rootProducer: types.Producer?

	function receiver:dispatch(actions: { types.BroadcastAction })
		assert(rootProducer, "Cannot dispatch actions before the middleware is applied")

		local dispatchers = rootProducer:getDispatchers()

		for _, action in actions do
			if dispatchers[action.name] then
				dispatchers[action.name](table.unpack(action.arguments))
			end
		end
	end

	function receiver.middleware(producer)
		rootProducer = producer

		requestState():andThen(function(serverState)
			local nextState = table.clone(producer:getState())

			for key, value in serverState do
				nextState[key] = value
			end

			producer:setState(nextState)
		end)

		return function(dispatch)
			return dispatch
		end
	end

	return receiver
end

return createBroadcastReceiver
