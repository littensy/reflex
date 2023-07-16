type CreateSelectorFunction =
	(<Result, Arguments...>(
		dependencies: { (Arguments...) -> any },
		combiner: (...any) -> Result,
		equalityOrOptions: (MemoizeOptions<Result> | EqualityCheck<Result>)?
	) -> (Arguments...) -> Result)
	& (<Result, A, Arguments...>(
		a: (Arguments...) -> A,
		combiner: (A) -> Result,
		options: MemoizeOptions<Result>?
	) -> (Arguments...) -> Result)
	& (<Result, A, B, Arguments...>(
		a: (Arguments...) -> A,
		b: (Arguments...) -> B,
		combiner: (A, B) -> Result,
		options: MemoizeOptions<Result>?
	) -> (Arguments...) -> Result)
	& (<Result, A, B, C, Arguments...>(
		a: (Arguments...) -> A,
		b: (Arguments...) -> B,
		c: (Arguments...) -> C,
		combiner: (A, B, C) -> Result,
		options: MemoizeOptions<Result>?
	) -> (Arguments...) -> Result)
	& (<Result, A, B, C, D, Arguments...>(
		a: (Arguments...) -> A,
		b: (Arguments...) -> B,
		c: (Arguments...) -> C,
		d: (Arguments...) -> D,
		combiner: (A, B, C, D) -> Result,
		options: MemoizeOptions<Result>?
	) -> (Arguments...) -> Result)
	& (<Result, A, B, C, D, E, Arguments...>(
		a: (Arguments...) -> A,
		b: (Arguments...) -> B,
		c: (Arguments...) -> C,
		d: (Arguments...) -> D,
		e: (Arguments...) -> E,
		combiner: (A, B, C, D, E) -> Result,
		options: MemoizeOptions<Result>?
	) -> (Arguments...) -> Result)
	& (<Result, A, B, C, D, E, F, Arguments...>(
		a: (Arguments...) -> A,
		b: (Arguments...) -> B,
		c: (Arguments...) -> C,
		d: (Arguments...) -> D,
		e: (Arguments...) -> E,
		f: (Arguments...) -> F,
		combiner: (A, B, C, D, E, F) -> Result,
		options: MemoizeOptions<Result>?
	) -> (Arguments...) -> Result)
	& (...(((...any) -> any) | MemoizeOptions<any>)) -> (...any) -> any

type EqualityCheck<T = any> = (current: T, previous: T) -> boolean

type MemoizeOptions<Result> = {
	--[=[
		The equality function used when comparing dependencies before calling
		the combiner. By default, a strict equality check is used.
	]=]
	equalityCheck: EqualityCheck?,

	--[=[
		The equality function used when comparing the result of the combiner
		to the previous value. If `true`, it will return the previous value
		of the combiner. By default, the latest result is always returned.
	]=]
	resultEqualityCheck: EqualityCheck<Result>?,
}

--[=[
	Memoizes a function by caching the result of the last call. Recomputes the
	result if any of the arguments have changed.
	@param callback The function to memoize.
	@param equalityCheck An optional equality function to use when
	comparing the arguments of the callback. By default, a strict equality
	check is used.
	@param resultEqualityCheck An optional equality function to use when comparing
	the result of the callback. By default, the latest result is always
	returned.
	@return A memoized function.
]=]
local function memoize(
	callback: (...any) -> any,
	equalityCheck: EqualityCheck?,
	resultEqualityCheck: EqualityCheck?
): (...any) -> any
	local lastArguments = {}
	local lastArgumentCount = -1
	local lastResult
	local firstRun = true

	return function(...)
		local argumentCount = select("#", ...)
		local result = lastResult

		if argumentCount ~= lastArgumentCount then
			result = callback(...)
			lastArgumentCount = argumentCount
			lastArguments = { ... }
		else
			for index = 1, argumentCount do
				local current = select(index, ...)
				local previous = lastArguments[index]

				if current ~= previous and (not equalityCheck or not equalityCheck(current, previous)) then
					result = callback(...)
					lastArguments = { ... }
					break
				end
			end
		end

		if not resultEqualityCheck then
			lastResult = result
			return result
		elseif firstRun or (lastResult ~= result and not resultEqualityCheck(result, lastResult)) then
			firstRun = false
			lastResult = result
		end

		return lastResult
	end
end

local function createSelectorImpl(...: ((...any) -> any) | MemoizeOptions<any>): (...any) -> any
	local arguments = table.pack(...)
	local dependencies, combiner, equalityOrOptions

	if type(...) == "table" then
		-- { ... }, combiner, equalityOrOptions
		dependencies, combiner, equalityOrOptions = ...
	elseif type(arguments[arguments.n]) == "table" then
		-- ..., combiner, options
		dependencies = table.create(arguments.n - 2)
		table.move(arguments, 1, arguments.n - 2, 1, dependencies)
		combiner, equalityOrOptions = arguments[arguments.n - 1], arguments[arguments.n]
	else
		-- ..., combiner
		dependencies = table.create(arguments.n - 1)
		table.move(arguments, 1, arguments.n - 1, 1, dependencies)
		combiner = arguments[arguments.n]
	end

	local options = if type(equalityOrOptions) == "function"
		then { equalityCheck = equalityOrOptions }
		else equalityOrOptions

	local resultEqualityCheck = options and options.resultEqualityCheck
	local equalityCheck = options and options.equalityCheck

	local dependencyCount = #dependencies
	local inputs = table.create(dependencyCount)
	local memoizedCombiner = memoize(combiner, equalityCheck, resultEqualityCheck)

	return memoize(function(...)
		for index = 1, dependencyCount do
			inputs[index] = dependencies[index](...)
		end

		return memoizedCombiner(table.unpack(inputs, 1, dependencyCount))
	end)
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
	@param options Options for memoizing the selector.
	@return A memoized selector function.
]=]
local createSelector: CreateSelectorFunction = createSelectorImpl :: any

return createSelector
