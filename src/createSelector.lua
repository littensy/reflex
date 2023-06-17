type CreateSelectorFunction = <Result, Input, Argument...>(
	dependencies: { (Argument...) -> Input },
	resultFunc: (...Input) -> Result
) -> (Argument...) -> Result

--[=[
	Memoizes a function by caching the result of the last call. Recomputes the
	result if any of the arguments have changed.
	@param callback The function to memoize.
	@return A memoized function.
]=]
local function memoize(callback: (...any) -> any): (...any) -> any
	local lastArguments = {}
	local lastArgumentCount = -1
	local lastResult

	return function(...)
		local argumentCount = select("#", ...)

		if argumentCount ~= lastArgumentCount then
			lastResult = callback(...)
			lastArgumentCount = argumentCount
			lastArguments = { ... }
		else
			for index = 1, argumentCount do
				if select(index, ...) ~= lastArguments[index] then
					lastResult = callback(...)
					lastArguments = { ... }
					break
				end
			end
		end

		return lastResult
	end
end

--[=[
	Creates a memoized selector function. The selector is only called if the
	outputs of the dependencies have changed.

	This function is only necessary if your selector is expensive to compute,
	or returns a new object (i.e. mapping an array). This is because selectors
	are called every state change, and if the selector returns a new object,
	the component will re-render even if the inputs haven't changed.

	@param dependencies A list of dependencies that the selector depends on.
	@param combiner A function that takes the dependencies as arguments and
	returns the result of the selector.
	@return A memoized selector function.
]=]
local function createSelector(dependencies: { (...any) -> any }, combiner: (...any) -> any)
	local dependencyCount = #dependencies
	local inputs = table.create(dependencyCount)
	local memoizedCombiner = memoize(combiner)

	return memoize(function(...)
		for index = 1, dependencyCount do
			inputs[index] = dependencies[index](...)
		end

		return memoizedCombiner(table.unpack(inputs, 1, dependencyCount))
	end)
end

return (createSelector :: any) :: CreateSelectorFunction
