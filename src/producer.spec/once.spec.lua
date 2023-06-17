return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local producer

	local function selectCount(state)
		return state.count
	end

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

	it("should return a function to unsubscribe", function()
		local calls = 0
		local unsubscribe = producer:once(selectCount, function()
			calls += 1
		end)
		expect(unsubscribe).to.be.a("function")
		unsubscribe()
		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(0)
	end)

	it("should call the listener once", function()
		local calls = 0

		producer:once(selectCount, function()
			calls += 1
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)
	end)

	it("should pass the current and previous state to the listener", function()
		local initialState = producer:getState(selectCount)
		local previousState
		local currentState

		producer:once(selectCount, function(current, previous)
			previousState = previous
			currentState = current
		end)

		producer:flush()
		expect(previousState).to.equal(nil)
		expect(currentState).to.equal(nil)

		producer.increment(1)
		producer:flush()
		expect(previousState).to.equal(initialState)
		expect(currentState).to.equal(producer:getState(selectCount))
	end)

	it("should receive a predicate", function()
		local calls = 0

		local function isGreaterThan(current, previous)
			return current > previous
		end

		producer:once(selectCount, isGreaterThan, function(current, previous)
			calls += 1
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(-1)
		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)
	end)
end
