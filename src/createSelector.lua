-- Overloads to allow for up to 6 dependencies with full type checking
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
	equalityCheck: EqualityCheck?,
	resultEqualityCheck: EqualityCheck<Result>?,
}

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

local function configure(...: any): ({ () -> any }, () -> any, MemoizeOptions<any>)
	local arguments = select("#", ...)

	local dependencies: { () -> any }
	local combiner: () -> any
	local configuration: MemoizeOptions<any> | EqualityCheck<any>

	if type(...) == "table" then
		-- { ... }, combiner, configuration
		dependencies, combiner, configuration = ...
	elseif select(-1, ...) == "table" then
		-- ..., combiner, options
		dependencies, combiner, configuration = table.create(arguments - 2), select(-2, ...), select(-1, ...)
		table.move(table.pack(...), 1, arguments - 2, 1, dependencies)
	else
		-- ..., combiner
		dependencies, combiner = table.create(arguments - 1), select(-1, ...)
		table.move(table.pack(...), 1, arguments - 1, 1, dependencies)
	end

	local options: MemoizeOptions<any> = if type(configuration) == "function"
		then { equalityCheck = configuration }
		else configuration or {}

	return dependencies, combiner, options
end

local function createSelector(...: any): (...any) -> any
	local dependencies, combiner, options = configure(...)
	local dependencyCount = #dependencies
	local inputs = table.create(dependencyCount)

	local memoizedCombiner = memoize(combiner, options.equalityCheck, options.resultEqualityCheck)

	return memoize(function(...)
		for index = 1, dependencyCount do
			inputs[index] = dependencies[index](...)
		end

		return memoizedCombiner(table.unpack(inputs, 1, dependencyCount))
	end)
end

return createSelector :: CreateSelectorFunction
