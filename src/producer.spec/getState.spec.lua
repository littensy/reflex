return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local producer

	beforeEach(function()
		producer = createProducer({ count = 0 }, {
			increment = function(state, amount)
				return { count = state.count + amount }
			end,
		})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should return the initial state", function()
		expect(producer:getState()).to.be.a("table")
		expect(producer:getState().count).to.equal(0)
	end)

	it("should return the updated state", function()
		producer.increment(1)
		expect(producer:getState().count).to.equal(1)
	end)

	it("should receive a selector function", function()
		local function selector(state)
			return state.count
		end
		expect(producer:getState(selector)).to.equal(0)
		producer.increment(1)
		expect(producer:getState(selector)).to.equal(1)
	end)
end
