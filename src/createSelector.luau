--- Creates a memoized selector function. The selector is only called if the
--- outputs of the dependencies have changed.
---
--- This function is only necessary if your selector is expensive to compute,
--- or returns a new object (i.e. mapping an array). This is because selectors
--- are called every state change, and if the selector returns a new object,
--- the component will re-render even if the inputs haven't changed.
---
--- @param dependencies A list of dependencies that the selector depends on.
--- @param selector A function that selects a subset of the state.
--- @return A memoized selector function.
local function createSelector(dependencies, selector)
	local dependencyCount = #dependencies
	local dependencyCache = {}
	local inputCache = {}

	local value
	local firstRun = true

	return function(...)
		-- local inputsChanged = firstRun
		-- local recompute = firstRun

		-- firstRun = false

		-- -- Iterate through arguments in any order. If any argument is not equal to
		-- -- the cached argument, then the inputs have changed.
		-- for index = 1, select("#", ...) do
		-- 	local input = select(index, ...)
		-- 	if input ~= inputCache[index] then
		-- 		inputsChanged = true
		-- 		inputCache[index] = input
		-- 	end
		-- end

		-- -- The above loop skips any argument that changed to 'nil', so this loop
		-- -- checks if any argument changed to 'nil'.
		-- if not inputsChanged then
		-- 	for index in inputCache do
		-- 		if select(index, ...) == nil then
		-- 			inputsChanged = true
		-- 			inputCache[index] = nil
		-- 		end
		-- 	end
		-- end

		-- if inputsChanged then
		-- 	for index, dependency in dependencies do
		-- 		local dependencyValue = dependency(...)
		-- 		if dependencyValue ~= dependencyCache[index] then
		-- 			dependencyCache[index] = dependencyValue
		-- 			recompute = true
		-- 		end
		-- 	end
		-- end

		local recompute = false

		-- TODO: Dependencies should be inexpensive to compute, so they might not
		-- have to be memoized. Test later.
		for index = 1, dependencyCount do
			local dependencyValue = dependencies[index](...)
			if dependencyValue ~= dependencyCache[index] then
				dependencyCache[index] = dependencyValue
				recompute = true
			end
		end

		if recompute then
			value = selector(unpack(dependencyCache, 1, dependencyCount))
		end

		return value
	end
end
