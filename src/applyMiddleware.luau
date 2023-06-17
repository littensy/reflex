local types = require(script.Parent.types)

--[=[
	Creates a producer enhancer that applies the given middleware to every
	function in the producer.

	A middleware is a function that is called before an action is dispatched.
	It receives the `dispatch` function, the `resolveCurrentDispatcher` function,
	and the `producer` object as arguments.

	The middleware returns a function that handles an incoming dispatcher call
	by calling and returning the `dispatch` function.

	```lua
	local loggerMiddleware: Middleware = function(dispatch, resolve, producer)
		return function(...)
			print(`producer.{resolve()} called`, ...)
			return dispatch(...)
		end
	end
	```

	@param middlewares A list of middleware to apply.
	@return A producer enhancer.
]=]
local function applyMiddleware(...: { types.Middleware }): <T>(producer: T) -> T
	local middlewares = { ... }

	return function(producer)
		local dispatchers = producer:getDispatchers()
		local currentDispatcher: string?

		local function resolveCurrentDispatcher()
			assert(currentDispatcher, "Cannot resolve dispatcher outside of middleware")
			return dispatchers[currentDispatcher]
		end

		for name, dispatcher in dispatchers do
			local dispatch = dispatcher

			for index = #middlewares, 1, -1 do
				dispatch = middlewares[index](dispatch, resolveCurrentDispatcher, producer)
			end

			local startDispatch = dispatch

			function dispatch(...)
				currentDispatcher = name
				return startDispatch(...)
			end

			dispatchers[name] = dispatch
			producer[name] = dispatch
		end

		return producer
	end
end

return applyMiddleware
