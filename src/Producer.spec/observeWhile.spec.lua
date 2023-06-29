return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local producer

	beforeEach(function()
		producer = createProducer({}, {})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should observe while the value is truthy", function()
		local valueObserved

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			valueObserved = value

			return function()
				valueObserved = nil
			end
		end)

		expect(valueObserved).to.never.be.ok()

		producer:setState({ value = 1 })
		producer:flush()
		expect(valueObserved).to.equal(1)

		producer:setState({})
		producer:flush()
		expect(valueObserved).to.never.be.ok()
	end)

	it("should observe while the predicate returns true", function()
		local valueObserved

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			return value and value > 0
		end, function(value)
			valueObserved = value

			return function()
				valueObserved = nil
			end
		end)

		expect(valueObserved).to.never.be.ok()

		producer:setState({ value = 1 })
		producer:flush()
		expect(valueObserved).to.equal(1)

		producer:setState({ value = -1 })
		producer:flush()
		expect(valueObserved).to.never.be.ok()
	end)

	it("should observe if the initial value is already truthy", function()
		producer:setState({ value = 1 })
		producer:flush()

		local valueObserved

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			valueObserved = value

			return function()
				valueObserved = nil
			end
		end)

		expect(valueObserved).to.equal(1)
	end)

	it("should observe if the predicate returns true for the initial value", function()
		producer:setState({ value = 1 })
		producer:flush()

		local valueObserved

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			return value == 1
		end, function(value)
			valueObserved = value

			return function()
				valueObserved = nil
			end
		end)

		expect(valueObserved).to.equal(1)
	end)

	it("should observe a nil value if the predicate returns true", function()
		local valueObserved

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			return value == nil
		end, function(value)
			valueObserved = value
		end)

		expect(valueObserved).to.equal(nil)
	end)

	it("should not re-run until the value becomes falsy", function()
		local calls = 0
		local cleanups = 0

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			calls += 1
			return function()
				cleanups += 1
			end
		end)

		expect(calls).to.equal(0)
		expect(cleanups).to.equal(0)

		producer:setState({ value = 1 })
		producer:flush()
		producer:setState({ value = 1 })
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(0)

		producer:setState({ value = 2 })
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(0)

		producer:setState({})
		producer:flush()
		producer:setState({})
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(1)

		producer:setState({ value = 3 })
		producer:flush()
		expect(calls).to.equal(2)
		expect(cleanups).to.equal(1)
	end)

	it("should not re-run until the predicate returns false", function()
		local calls = 0
		local cleanups = 0

		producer:observeWhile(function(state)
			return state.value
		end, function(value)
			return value == 1
		end, function(value)
			calls += 1
			return function()
				cleanups += 1
			end
		end)

		expect(calls).to.equal(0)
		expect(cleanups).to.equal(0)

		producer:setState({ value = 1 })
		producer:flush()
		producer:setState({ value = 1 })
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(0)

		producer:setState({ value = 2 })
		producer:flush()
		producer:setState({ value = 2 })
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(1)

		producer:setState({ value = 1 })
		producer:flush()
		expect(calls).to.equal(2)
		expect(cleanups).to.equal(1)
	end)

	it("should cleanup the observer when the cleanup function is called", function()
		local calls = 0
		local cleanups = 0

		local cleanup = producer:observeWhile(function(state)
			return state.value
		end, function(value)
			calls += 1
			return function()
				cleanups += 1
			end
		end)

		producer:setState({ value = 1 })
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(0)

		cleanup()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(1)

		producer:setState({ value = 2 })
		producer:flush()
		expect(calls).to.equal(1)
		expect(cleanups).to.equal(1)
	end)
end
