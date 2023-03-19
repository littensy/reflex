return function()
	local createProducer = require(script.Parent["create-producer"]).createProducer
	local Promise = require(game:GetService("ReplicatedStorage").include.Promise)

	local producer

	local initialState = { counter = 0, setter = 0 }
	local actions = {
		increment = function(state, amount)
			return { counter = state.counter + amount, setter = state.setter }
		end,
		decrement = function(state, amount)
			return { counter = state.counter - amount, setter = state.setter }
		end,
		setSetter = function(state, value)
			return { counter = state.counter, setter = value }
		end,
	}

	describe("createProducer", function()
		it("should return a producer table", function()
			producer = createProducer(initialState, actions)
			expect(producer).to.be.a("table")
			expect(producer.getState).to.be.a("function")
			expect(producer.getDispatchers).to.be.a("function")
			expect(producer.flush).to.be.a("function")
			expect(producer.subscribe).to.be.a("function")
			expect(producer.once).to.be.a("function")
			expect(producer.wait).to.be.a("function")
		end)
	end)

	describe("Producer.getState", function()
		it("should return the initial state", function()
			local state = producer:getState()
			expect(state).to.be.a("table")
			expect(state.counter).to.equal(0)
			expect(state.setter).to.equal(0)
		end)

		it("should return a selection of the state", function()
			local selection = producer:getState(function(state)
				return state.counter
			end)
			expect(selection).to.be.a("number")
		end)
	end)

	describe("Producer.getDispatchers", function()
		it("should return a table of dispatchers", function()
			local dispatchers = producer:getDispatchers()
			expect(dispatchers).to.be.a("table")
			expect(dispatchers.increment).to.be.a("function")
			expect(dispatchers.decrement).to.be.a("function")
			expect(dispatchers.setSetter).to.be.a("function")
		end)
	end)

	describe("Producer[action]", function()
		it("should dispatch the increment action", function()
			producer.increment(1)
			local state = producer:getState()
			expect(state.counter).to.equal(1)
			expect(state.setter).to.equal(0)
		end)

		it("should dispatch the decrement action", function()
			producer.decrement(1)
			local state = producer:getState()
			expect(state.counter).to.equal(0)
			expect(state.setter).to.equal(0)
		end)
	end)

	describe("Producer.subscribe", function()
		it("should return an unsubscribe function", function()
			local unsubscribe = producer:subscribe(function() end)
			expect(unsubscribe).to.be.a("function")
			unsubscribe()
		end)

		it("should call the listener when the state changes", function()
			local called = false
			local unsubscribe = producer:subscribe(function()
				called = true
			end)
			producer.increment(1)
			producer:flush()
			expect(called).to.equal(true)
			unsubscribe()
		end)

		it("should pass the previous state to the listener", function()
			local prevState = producer:getState()
			local receivedState
			local unsubscribe = producer:subscribe(function(_, state)
				receivedState = state
			end)
			producer.increment(1)
			producer:flush()
			expect(receivedState).to.equal(prevState)
			unsubscribe()
		end)

		it("should not call the listener when the state does not change", function()
			local called = false
			local unsubscribe = producer:subscribe(function()
				called = true
			end)
			producer:flush()
			expect(called).to.equal(false)
			unsubscribe()
		end)

		it("should not call the listener after it is unsubscribed", function()
			local called = false
			local unsubscribe = producer:subscribe(function()
				called = true
			end)
			unsubscribe()
			producer.increment(1)
			producer:flush()
			expect(called).to.equal(false)
		end)

		it("should call the listener with the new state", function()
			local prevState = producer:getState()
			local state
			local unsubscribe = producer:subscribe(function(newState)
				state = newState
			end)
			producer.increment(1)
			producer:flush()
			expect(state).to.be.a("table")
			expect(state.counter).to.equal(prevState.counter + 1)
			unsubscribe()
		end)

		it("should only call the listener once if it flushed multiple times", function()
			local called = 0
			local unsubscribe = producer:subscribe(function()
				called = called + 1
			end)
			producer.increment(1)
			producer.increment(1)
			producer:flush()
			expect(called).to.equal(1)
			unsubscribe()
		end)

		it("should pass the current and previous state", function()
			local previousState = producer:getState()
			local unsubscribe = producer:subscribe(function(receivedState, receivedPreviousState)
				expect(receivedState).to.be.a("table")
				expect(receivedPreviousState).to.be.a("table")
				expect(receivedState).to.never.equal(receivedPreviousState)
				expect(receivedState).to.equal(producer:getState())
				expect(receivedPreviousState).to.equal(previousState)
			end)

			producer.increment(1)
			producer:flush()
			unsubscribe()
		end)
	end)

	describe("Producer.subscribe(selector)", function()
		local selector = function(state)
			return state.counter
		end

		it("should return an unsubscribe function", function()
			local unsubscribe = producer:subscribe(selector, function() end)
			expect(unsubscribe).to.be.a("function")
			unsubscribe()
		end)

		it("should call the listener when the state changes", function()
			local called = false
			local unsubscribe = producer:subscribe(selector, function()
				called = true
			end)
			producer.increment(1)
			producer:flush()
			expect(called).to.equal(true)
			unsubscribe()
		end)

		it("should not call the listener when a different part of the state changes", function()
			local called = false
			local unsubscribe = producer:subscribe(selector, function()
				called = true
			end)
			producer.setSetter(1)
			producer:flush()
			expect(called).to.equal(false)
			unsubscribe()
		end)

		it("should pass the current and previous state", function()
			local previousState = selector(producer:getState())
			local unsubscribe = producer:subscribe(selector, function(receivedState, receivedPreviousState)
				expect(receivedState).to.be.a("number")
				expect(receivedPreviousState).to.be.a("number")
				expect(receivedState).to.never.equal(receivedPreviousState)
				expect(receivedState).to.equal(selector(producer:getState()))
				expect(receivedPreviousState).to.equal(previousState)
			end)

			producer.increment(1)
			producer:flush()
			unsubscribe()
		end)
	end)

	describe("Producer.setState", function()
		it("should set the state", function()
			producer:setState({
				counter = 1,
				setter = 1,
			})
			local state = producer:getState()
			expect(state.counter).to.equal(1)
			expect(state.setter).to.equal(1)
		end)
	end)

	describe("Producer.once", function()
		it("should call the listener once", function()
			local called = 0
			producer:once(function(state)
				return state.counter
			end, function()
				called = called + 1
			end)
			producer.increment(1)
			producer:flush()
			expect(called).to.equal(1)
		end)

		it("should not call the listener again", function()
			local called = 0
			producer:once(function(state)
				return state.counter
			end, function()
				called = called + 1
			end)
			producer.increment(1)
			producer:flush()
			producer.increment(1)
			producer:flush()
			expect(called).to.equal(1)
		end)
	end)

	describe("Producer.wait", function()
		it("should return a Promise", function()
			local promise = producer:wait(function()
				return true
			end)
			expect(promise).to.be.a("table")
			expect(promise.andThen).to.be.a("function")
			promise:cancel()
		end)

		it("should resolve when the selected state changes", function()
			local current = producer:getState()
			local promise = producer
				:wait(function(state)
					return state.counter == current.counter
				end)
				:andThen(function(isEqual)
					expect(isEqual).to.equal(false)
				end)
			producer.increment(1)
			producer:flush()
		end)
	end)

	describe("Producer", function()
		it("should contain action functions", function()
			expect(producer.increment).to.be.a("function")
			expect(producer.decrement).to.be.a("function")
			expect(producer.setSetter).to.be.a("function")
		end)

		it("should support Promise.fromEvent", function()
			expect(function()
				Promise.fromEvent(producer):cancel()
			end).never.to.throw()
		end)

		it("should resolve Promise.fromEvent when the state changes", function()
			local promise = Promise.fromEvent(producer, function(state)
				return state.setter == 1
			end)
			producer.setSetter(1)
			producer:flush()
			local resolved, state = promise:await()
			expect(resolved).to.equal(true)
			expect(state.setter).to.equal(1)
		end)
	end)
end
