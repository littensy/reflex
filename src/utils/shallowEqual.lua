--[=[
	Returns whether or not two tables are shallowly equal, or in other words,
	have the same set of key-value pairs.
	@param a The first table to compare.
	@param b The second table to compare.
	@returns Whether or not the tables are shallowly equal.
]=]
local function shallowEqual(a: any, b: any): boolean
	if a == b then
		return true
	end

	if type(a) ~= "table" or type(b) ~= "table" then
		return false
	end

	for key, value in a do
		if b[key] ~= value then
			return false
		end
	end

	for key, value in b do
		if a[key] ~= value then
			return false
		end
	end

	return true
end

return shallowEqual
