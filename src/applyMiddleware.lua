--!nolint ImportUnused
local types = require(script.Parent.types)

--[=[
	Creates a producer enhancer that applies the given middleware to the
	producer.

	Initially, a middleware is called once when it is applied to a producer.
	Next, the returned function is called on a dispatcher in the producer.
	The final function is called whenever the dispatcher is called.

	```lua
	local loggerMiddleware: Reflex.Middleware = function(producer)
		print("Initial state:", producer.getState())
		return function(dispatch, name)
			return function(...)
				print(`Dispatching {name}:`, ...args)
				return dispatch(...)
			end
		end
	end

	producer:enhance(applyMiddleware(loggerMiddleware))
	```

	@param middlewares A list of middleware to apply.
	@return A producer enhancer.
]=]
local function applyMiddleware(...: types.Middleware): <T>(producer: T) -> T
	local arguments = { ... }

	return function(producer)
		local middlewares = table.clone(arguments)
		local dispatchers = producer:getDispatchers()

		for index, middleware in middlewares do
			middlewares[index] = middleware(producer)
		end

		for name, dispatcher in dispatchers do
			for index = #middlewares, 1, -1 do
				dispatcher = middlewares[index](dispatcher, name)
			end

			dispatchers[name] = dispatcher
			producer[name] = dispatcher
		end

		return producer
	end
end

return applyMiddleware
