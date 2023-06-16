local applyMiddleware = require(script.Parent.Parent.applyMiddleware)

local function stringify(value: unknown): string
	if type(value) == "string" then
		return string.format("%q", value)
	elseif type(value) == "table" then
		local result = "{ "

		for key, value in value :: {} do
			result ..= "[" .. stringify(key) .. "] = " .. stringify(value) .. ","
		end

		return result .. " }"
	else
		return tostring(value)
	end
end

--- A middleware that logs every action that is dispatched, and the new state
--- after the action is handled.
local loggerMiddleware: applyMiddleware.Middleware = function(dispatch, name, producer)
	return function(...)
		local arguments = { ... }

		for index, value in arguments do
			arguments[index] = stringify(value)
		end

		print(`[Reflex]: Dispatching {name()}({table.concat(arguments, ", ", 1, select("#", ...))})`)

		local result = dispatch(...)

		print("[Reflex]: New state:", result)

		return result
	end
end

return loggerMiddleware
