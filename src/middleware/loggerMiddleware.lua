local types = require(script.Parent.Parent.types)
local logger = require(script.Parent.Parent.utils.logger)

local loggerMiddleware: types.Middleware = function(producer)
	logger.info("Initial state:", producer:getState())

	producer:subscribe(function(state)
		logger.info("State changed:", state)
	end)

	return function(dispatch, name)
		return function(...)
			local output = { `Dispatching {name}\nArguments:` }

			for index = 1, select("#", ...) do
				table.insert(output, `\n\t{index}.`)
				table.insert(output, select(index, ...))
			end

			logger.info(table.unpack(output))

			return dispatch(...)
		end
	end
end

return loggerMiddleware
