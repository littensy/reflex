return function()
	local testSelector = require(script.Parent.testSelector)

	it("should return false if the selector is not memoized", function()
		local value = {}
		local function badSelector(state)
			return {}
		end
		expect(testSelector(badSelector, value, { value = value })).to.equal(false)
	end)

	it("should return true if the selector is memoized", function()
		local value = {}
		local function goodSelector(state)
			return state.value
		end
		expect(testSelector(goodSelector, value, { value = value })).to.equal(true)
	end)
end
