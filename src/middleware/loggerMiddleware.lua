local types = require(script.Parent.Parent.types)

local function stringify(value: unknown, _depth: number?): string
	local depth = _depth or 0

	if type(value) == "string" then
		return string.format("%q", value)
	elseif type(value) == "table" and depth < 2 then
		local result = "{"

		for k, v in value :: {} do
			result ..= "[" .. stringify(k, depth + 1) .. "] = " .. stringify(v, depth + 1) .. ", "
		end

		return result .. "}"
	else
		return tostring(value)
	end
end

--[=[
	A middleware that logs every action that is dispatched, and the new state
	after the action is handled.
]=]
local loggerMiddleware: types.Middleware = function(producer)
	print("[Reflex]: Mounted with state", producer:getState())

	producer:subscribe(function(state)
		print("[Reflex]: State changed to", state)
	end)

	return function(dispatch, name)
		return function(...)
			local arguments = table.pack(...)

			for index = 1, arguments.n do
				arguments[index] = stringify(arguments[index])
			end

			print(`[Reflex]: Dispatching {name}({table.concat(arguments, ", ")})`)

			return dispatch(...)
		end
	end
end

return loggerMiddleware
