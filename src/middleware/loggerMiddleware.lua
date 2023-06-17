local types = require(script.Parent.Parent.types)

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

--[=[
	A middleware that logs every action that is dispatched, and the new state
	after the action is handled.
]=]
local loggerMiddleware: types.Middleware = function(dispatch, resolve, producer)
	return function(...)
		local arguments = { ... }

		for index, value in arguments do
			arguments[index] = stringify(value)
		end

		print(`[Reflex]: Dispatching {resolve()}({table.concat(arguments, ", ", 1, select("#", ...))})`)

		local result = dispatch(...)

		print("[Reflex]: New state:", result)

		return result
	end
end

return loggerMiddleware