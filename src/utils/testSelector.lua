local RunService = game:GetService("RunService")

local IS_STUDIO = RunService:IsStudio()
local TEST_WARNING = [[
Reflex detected a selector function that returns conflicting values for the same input!
This is likely caused by one of the following:

- The selector function is not memoized and should use 'createSelector'
- The selector function is memoized but is not idempotent

Learn more about writing selectors here:
https://littensy.github.io/reflex/docs/guides/using-selectors

%s]]

--[=[
	Tests a selector function's memoization. If the selector function is not
	memoized, it will output a warning in Roblox Studio.
	@param selector The selector function to test.
	@param expectedValue The expected value of the selector function.
	@param ... The arguments to pass to the selector function.
	@returns Whether the test passed.
]=]
local function testSelector<T, U...>(selector: (U...) -> T, expectedValue: T, ...: U...)
	if selector(...) == expectedValue then
		return true
	end

	if IS_STUDIO then
		local traceback = debug.traceback("Function traceback", 2)
		warn(string.format(TEST_WARNING, traceback))
	end

	return false
end

return testSelector
