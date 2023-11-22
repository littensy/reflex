return function()
	local Promise = require(script.Parent.Parent.Promise)
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

	it("should return a producer", function()
		expect(producer).to.be.a("table")
		expect(producer.getState).to.be.a("function")
		expect(producer.setState).to.be.a("function")
		expect(producer.getDispatchers).to.be.a("function")
		expect(producer.getActions).to.be.a("function")
		expect(producer.clone).to.be.a("function")
		expect(producer.flush).to.be.a("function")
		expect(producer.subscribe).to.be.a("function")
		expect(producer.once).to.be.a("function")
		expect(producer.wait).to.be.a("function")
		expect(producer.observe).to.be.a("function")
		expect(producer.destroy).to.be.a("function")
		expect(producer.enhance).to.be.a("function")
		expect(producer.applyMiddleware).to.be.a("function")
		expect(producer.Connect).to.be.a("function")
		expect(producer.Once).to.be.a("function")
		expect(producer.Wait).to.be.a("function")
	end)

	it("should expose the dispatcher functions", function()
		expect(producer.increment).to.be.a("function")
		expect(producer.decrement).to.be.a("function")
		producer.increment(1)
		expect(producer:getState().count).to.equal(1)
		producer.decrement(1)
		expect(producer:getState().count).to.equal(0)
	end)

	it("should support Promise.fromEvent", function()
		local promise = Promise.fromEvent(producer, function(current, previous)
			return current.count > previous.count
		end)

		producer.decrement(1)
		producer:flush()

		expect(promise:getStatus()).to.equal(Promise.Status.Started)

		producer.increment(1)
		producer:flush()

		local status, state = promise:timeout(1):awaitStatus()
		expect(status).to.equal(Promise.Status.Resolved)
		expect(state.count).to.equal(0)
	end)
end
