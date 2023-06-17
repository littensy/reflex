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

	it("should return a function to unsubscribe", function()
		local calls = 0
		local unsubscribe = producer:subscribe(function()
			calls += 1
		end)
		expect(unsubscribe).to.be.a("function")
		unsubscribe()
		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(0)
	end)

	it("should call the listener when the state changes", function()
		local calls = 0

		producer:subscribe(function()
			calls += 1
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(2)
	end)

	it("should pass the current and previous state to the listener", function()
		local initialState = producer:getState()
		local previousState
		local currentState

		producer:subscribe(function(current, previous)
			previousState = previous
			currentState = current
		end)

		producer.increment(1)
		producer:flush()

		expect(previousState).to.equal(initialState)
		expect(currentState).to.equal(producer:getState())
		expect(currentState).to.never.equal(previousState)
	end)

	it("should call the listener once for bulk updates", function()
		local calls = 0

		producer:subscribe(function()
			calls += 1
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer.increment(1)
		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)
	end)

	it("should call the listener once for nested updates", function()
		local calls = 0

		producer:subscribe(function()
			calls += 1
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer.increment(1)
		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)
	end)

	it("should allow updates during a flush", function()
		local initialState = producer:getState()
		local newState, newStateFromFlush

		producer:subscribe(function()
			producer.increment(1)
			newStateFromFlush = producer:getState()
		end)

		producer:subscribe(function(current, previous)
			expect(current).to.equal(newState)
			expect(current).to.never.equal(newStateFromFlush)
			expect(previous).to.equal(initialState)
		end)

		producer.increment(1)
		newState = producer:getState()
		producer:flush()

		expect(newStateFromFlush).to.equal(newState)
	end)

	it("should defer subscriptions from within a listener", function()
		local calls = 0

		producer:subscribe(function()
			calls += 1
			if calls == 1 then
				producer:subscribe(function()
					calls += 1
				end)
			end
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(3)
	end)

	it("should receive a selector function", function()
		local value

		producer:subscribe(selectCount, function(count)
			value = count
		end)

		producer:flush()
		expect(value).to.equal(nil)

		producer.increment(1)
		producer:flush()
		expect(value).to.equal(1)

		producer.increment(1)
		producer:flush()
		expect(value).to.equal(2)
	end)

	it("should not call the listener if the selector returns the same value", function()
		local calls = 0

		producer:subscribe(selectCount, function()
			calls += 1
		end)

		producer:flush()
		expect(calls).to.equal(0)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(1)

		producer.increment(1)
		producer:flush()
		expect(calls).to.equal(2)

		producer.increment(0)
		producer:flush()
		expect(calls).to.equal(2)
	end)
end
