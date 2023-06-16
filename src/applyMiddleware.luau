local createProducer = require(script.Parent.createProducer)

type DefaultProducer = createProducer.Producer<any>

export type Middleware<T = DefaultProducer> = (
	dispatch: (...any) -> any,
	resolveCurrentDispatcher: () -> string,
	producer: T
) -> (action: any) -> any

--- Creates a producer enhancer that applies the given middleware to every
--- function in the producer.
--- @param middlewares A list of middleware to apply.
--- @return A producer enhancer.
local function applyMiddleware(...: { Middleware }): <T>(producer: T) -> T
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
