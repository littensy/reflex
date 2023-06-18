return function()
	local combineProducers = require(script.Parent.combineProducers)
	local createProducer = require(script.Parent.createProducer)

	local producers, producer

	beforeEach(function()
		producers = {
			foo = createProducer({ count = 0 }, {
				incrementFoo = function(state, amount)
					return { count = state.count + amount }
				end,
				shared = function(state, amount)
					return { count = state.count + amount }
				end,
			}),
			bar = createProducer({ count = 0 }, {
				incrementBar = function(state, amount)
					return { count = state.count + amount }
				end,
				shared = function(state, amount)
					return { count = state.count + amount }
				end,
			}),
		}

		producer = combineProducers(producers)
	end)

	afterEach(function()
		producer:destroy()
		for _, producer in producers do
			producer:destroy()
		end
	end)

	it("should combine the initial state of each producer", function()
		local initialState = producer:getState()
		expect(initialState).to.be.a("table")
		expect(initialState.foo).to.be.a("table")
		expect(initialState.foo.count).to.equal(0)
		expect(initialState.bar).to.be.a("table")
		expect(initialState.bar.count).to.equal(0)
	end)

	it("should include every dispatcher function", function()
		expect(producer.incrementFoo).to.be.a("function")
		expect(producer.incrementBar).to.be.a("function")
		expect(producer.shared).to.be.a("function")
	end)

	it("should dispatch to the correct producer", function()
		producer.incrementFoo(1)
		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(0)

		producer.incrementBar(1)
		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(1)
	end)

	it("should combine dispatchers with the same name", function()
		producer.shared(1)
		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(1)
	end)
end
