local types = require(script.Parent.Parent.types)
local hydration = require(script.Parent.hydration)

local function createReceiver(options: types.BroadcastReceiverOptions): types.BroadcastReceiver
	local producer: types.Producer?

	local function hydrate(self: types.BroadcastReceiver, globalState: { [any]: any })
		assert(producer, "Cannot use a broadcast receiver before the middleware is applied.")

		local nextState = table.clone(producer:getState())

		for key, value in globalState do
			nextState[key] = value
		end

		producer:setState(nextState)
	end

	local function dispatch(self: types.BroadcastReceiver, actions: { types.BroadcastAction })
		assert(producer, "Cannot use a broadcast receiver before the middleware is applied.")

		local dispatchers = producer:getDispatchers()

		for _, action in actions do
			local dispatcher = dispatchers[action.name]

			if dispatcher then
				dispatcher(table.unpack(action.arguments))
			elseif hydration.isHydratePayload(action) then
				self:hydrate(action.arguments[1])
			end
		end
	end

	local middleware: types.Middleware = function(currentProducer)
		producer = currentProducer
		options.start()

		return function(nextDispatch)
			return nextDispatch
		end
	end

	return {
		hydrate = hydrate,
		dispatch = dispatch,
		middleware = middleware,
	}
end

return createReceiver
