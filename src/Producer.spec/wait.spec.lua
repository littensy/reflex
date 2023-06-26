return function()
	local Promise = require(script.Parent.Parent.Promise)
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

	it("should unsubscribe on promise cancel", function()
		local calls = 0

		local function selectorSpy(state)
			calls += 1
			return state.count
		end

		local promise = producer:wait(selectorSpy)
		local initialCalls = calls

		promise:cancel()
		producer.increment(1)
		producer:flush()

		expect(calls).to.equal(initialCalls)
		expect(promise:getStatus()).to.equal(Promise.Status.Cancelled)
	end)

	it("should resolve with the new state", function()
		local promise = producer:wait(selectCount)
		producer.increment(1)
		producer:flush()
		local status, count = promise:timeout(1):awaitStatus()
		expect(status).to.equal(Promise.Status.Resolved)
		expect(count).to.equal(1)
	end)

	it("should receive a predicate", function()
		local function isGreaterThan(current, previous)
			return current > previous
		end

		local promise = producer:wait(selectCount, isGreaterThan)

		producer.decrement(1)
		producer:flush()

		expect(promise:getStatus()).to.equal(Promise.Status.Started)

		producer.increment(2)
		producer:flush()

		local status, count = promise:timeout(1):awaitStatus()
		expect(status).to.equal(Promise.Status.Resolved)
		expect(count).to.equal(1)
	end)
end
