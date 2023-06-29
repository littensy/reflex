return function()
	local shallowEqual = require(script.Parent.shallowEqual)

	it("should return true when tables are equal", function()
		local value = {}
		expect(shallowEqual(value, value)).to.equal(true)
	end)

	it("should return true when both tables are empty", function()
		expect(shallowEqual({}, {})).to.equal(true)
	end)

	it("should return true when tables have the same key-value pairs", function()
		expect(shallowEqual({ foo = 1 }, { foo = 1 })).to.equal(true)
		expect(shallowEqual({ bar = 1, baz = 2 }, { bar = 1, baz = 2 })).to.equal(true)
	end)

	it("should return false when tables have different key-value pairs", function()
		expect(shallowEqual({ foo = 1 }, { foo = 2 })).to.equal(false)
	end)

	it("should return false when tables have different keys", function()
		expect(shallowEqual({ foo = 1 }, { bar = 1 })).to.equal(false)
		expect(shallowEqual({ foo = 1 }, { foo = 1, bar = 1 })).to.equal(false)
		expect(shallowEqual({ foo = 1, bar = 1 }, { foo = 1 })).to.equal(false)
	end)
end
