local types = require(script.Parent.Parent.types)

--[=[
	Creates a broadcast receiver object that can be used to dispatch actions
	broadcasted by the server.
	@param options The options for the broadcast receiver.
	@return The broadcast receiver.
]=]
local function createBroadcastReceiver(options: types.BroadcastReceiverOptions): types.BroadcastReceiver
	local requestState = options.requestState

	local rootProducer: types.Producer?

	local middleware: types.Middleware = function(dispatch, _, producer)
		rootProducer = producer

		requestState():andThen(function(serverState)
			local nextState = table.clone(producer:getState())

			for key, value in serverState do
				nextState[key] = value
			end

			producer:setState(nextState)
		end)

		return dispatch
	end

	local function dispatch(actions: { types.BroadcastAction })
		assert(rootProducer, "Cannot dispatch actions before the middleware is applied")

		local dispatchers = rootProducer:getDispatchers()

		for _, action in actions do
			if dispatchers[action.name] then
				dispatchers[action.name](table.unpack(action.arguments))
			end
		end
	end

	return {
		middleware = middleware,
		dispatch = dispatch,
	}
end

return createBroadcastReceiver
