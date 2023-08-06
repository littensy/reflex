local types = require(script.Parent.types)

type Enhancer = (producer: types.Producer) -> types.Producer

local function applyMiddleware(...: types.Middleware): Enhancer
	local arguments = table.pack(...)

	return function(producer: types.Producer)
		local middlewares: { [number]: (...any) -> any, n: number } = table.clone(arguments)
		local dispatchers: { [string]: (...any) -> any } = producer:getDispatchers()

		for index, middleware in ipairs(middlewares) do
			middlewares[index] = middleware(producer)
		end

		for name, dispatcher in dispatchers do
			for index = middlewares.n, 1, -1 do
				dispatcher = middlewares[index](dispatcher, name)
			end

			(producer :: any)[name] = dispatcher
			dispatchers[name] = dispatcher
		end

		return producer
	end
end

return applyMiddleware
