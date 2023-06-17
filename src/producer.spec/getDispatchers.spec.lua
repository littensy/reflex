return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local producer

	beforeEach(function()
		producer = createProducer({ count = 0 }, {
			increment = function(state, amount)
				return { count = state.count + amount }
			end,
			decrement = function(state, amount)
				return { count = state.count - amount }
			end,
		})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should return a table of dispatchers", function()
		local dispatchers = producer:getDispatchers()
		expect(dispatchers).to.be.a("table")
		expect(dispatchers.increment).to.be.a("function")
		expect(dispatchers.decrement).to.be.a("function")
	end)

	it("should return dispatchers that update the state", function()
		local dispatchers = producer:getDispatchers()
		dispatchers.increment(1)
		expect(producer:getState().count).to.equal(1)
		dispatchers.decrement(1)
		expect(producer:getState().count).to.equal(0)
	end)
end
