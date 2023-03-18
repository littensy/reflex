return function()
	local createProducer = require(script.Parent["create-producer"]).createProducer
	local combineProducers = require(script.Parent["combine-producers"]).combineProducers
	local Promise = require(game:GetService("ReplicatedStorage").include.Promise)

	local producerA = createProducer({ sharedCounter = 0, privateCounter = 0 }, {
		sharedIncrement = function(state, amount)
			return { sharedCounter = state.sharedCounter + amount, privateCounter = state.privateCounter }
		end,
		privateIncrementA = function(state, amount)
			return { privateCounter = state.privateCounter + amount, sharedCounter = state.sharedCounter }
		end,
	})

	local producerB = createProducer({ sharedCounter = 0, privateCounter = 0 }, {
		sharedIncrement = function(state, amount)
			return { sharedCounter = state.sharedCounter + amount, privateCounter = state.privateCounter }
		end,
		privateIncrementB = function(state, amount)
			return { privateCounter = state.privateCounter + amount, sharedCounter = state.sharedCounter }
		end,
	})

	local combinedProducer

	describe("combineProducers", function()
		combinedProducer = combineProducers({
			producerA = producerA,
			producerB = producerB,
		})

		it("should return a producer table", function()
			expect(combinedProducer).to.be.a("table")
			expect(combinedProducer.getState).to.be.a("function")
			expect(combinedProducer.getDispatchers).to.be.a("function")
			expect(combinedProducer.flush).to.be.a("function")
			expect(combinedProducer.subscribe).to.be.a("function")
			expect(combinedProducer.observe).to.be.a("function")
			expect(combinedProducer.once).to.be.a("function")
			expect(combinedProducer.wait).to.be.a("function")
			expect(combinedProducer.select).to.be.a("function")
		end)

		it("should merge the action functions", function()
			expect(combinedProducer.sharedIncrement).to.be.a("function")
			expect(combinedProducer.privateIncrementA).to.be.a("function")
			expect(combinedProducer.privateIncrementB).to.be.a("function")
		end)
	end)

	describe("CombinedProducer.getState", function()
		it("should return the combined state", function()
			local state = combinedProducer:getState()
			expect(state).to.be.a("table")
			expect(state.producerA).to.be.a("table")
			expect(state.producerB).to.be.a("table")
			expect(state.producerA.sharedCounter).to.equal(0)
			expect(state.producerA.privateCounter).to.equal(0)
			expect(state.producerB.sharedCounter).to.equal(0)
			expect(state.producerB.privateCounter).to.equal(0)
		end)
	end)

	describe("CombinedProducer.getDispatchers", function()
		it("should return a table of dispatchers", function()
			local dispatchers = combinedProducer:getDispatchers()
			expect(dispatchers).to.be.a("table")
			expect(dispatchers.sharedIncrement).to.be.a("function")
			expect(dispatchers.privateIncrementA).to.be.a("function")
			expect(dispatchers.privateIncrementB).to.be.a("function")
		end)
	end)

	describe("CombinedProducer[action]", function()
		it("should dispatch the sharedIncrement action globally", function()
			combinedProducer.sharedIncrement(1)
			local state = combinedProducer:getState()
			expect(state.producerA.sharedCounter).to.equal(1)
			expect(state.producerB.sharedCounter).to.equal(1)
		end)

		it("should dispatch the privateIncrementA action", function()
			combinedProducer.privateIncrementA(1)
			local state = combinedProducer:getState()
			expect(state.producerA.privateCounter).to.equal(1)
			expect(state.producerB.privateCounter).to.equal(0)
		end)

		it("should dispatch the privateIncrementB action", function()
			combinedProducer.privateIncrementB(1)
			local state = combinedProducer:getState()
			expect(state.producerA.privateCounter).to.equal(1)
			expect(state.producerB.privateCounter).to.equal(1)
		end)
	end)

	describe("CombinedProducer.subscribe", function()
		it("should subscribe to the combined producer", function()
			local unsubscribe = combinedProducer:subscribe(function(state)
				expect(state).to.be.a("table")
				expect(state.producerA).to.be.a("table")
				expect(state.producerB).to.be.a("table")
				expect(state.producerA.sharedCounter).to.equal(2)
				expect(state.producerA.privateCounter).to.equal(2)
				expect(state.producerB.sharedCounter).to.equal(2)
				expect(state.producerB.privateCounter).to.equal(2)
			end)

			combinedProducer.sharedIncrement(1)
			combinedProducer.privateIncrementA(1)
			combinedProducer.privateIncrementB(1)
			combinedProducer:flush()
			unsubscribe()
		end)

		it("should call the listener when the state changes", function()
			local called = false
			local unsubscribe = combinedProducer:subscribe(function()
				called = true
			end)

			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
			unsubscribe()
			expect(called).to.equal(true)
		end)

		it("should not call the listener when the state does not change", function()
			local called = false
			local unsubscribe = combinedProducer:subscribe(function()
				called = true
			end)

			combinedProducer:flush()
			unsubscribe()
			expect(called).to.equal(false)
		end)

		it("should pass the current and previous state", function()
			local previousState = combinedProducer:getState()
			local unsubscribe = combinedProducer:subscribe(function(receivedState, receivedPreviousState)
				expect(receivedState).to.be.a("table")
				expect(receivedPreviousState).to.be.a("table")
				expect(receivedState).to.never.equal(receivedPreviousState)
				expect(receivedState).to.equal(combinedProducer:getState())
				expect(receivedPreviousState).to.equal(previousState)
			end)

			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
			unsubscribe()
		end)
	end)

	describe("CombinedProducer.observe", function()
		it("should observe a selection of the combined producer", function()
			local function selectPrivateCounterA(state)
				return state.producerA.privateCounter
			end

			local unsubscribe = combinedProducer:observe(selectPrivateCounterA, function(privateCounterA)
				expect(privateCounterA).to.equal(3)
			end)

			combinedProducer.privateIncrementA(1)
			combinedProducer:flush()
			unsubscribe()
		end)

		it("should not update if a different part of the state changes", function()
			local function selectPrivateCounterA(state)
				return state.producerA.privateCounter
			end

			local updated = false

			local unsubscribe = combinedProducer:observe(selectPrivateCounterA, function(privateCounterA)
				updated = true
			end)

			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
			unsubscribe()

			expect(updated).to.equal(false)
		end)

		it("should pass the current and previous state", function()
			local function selectPrivateCounterA(state)
				return state.producerA.privateCounter
			end

			local previousState = selectPrivateCounterA(combinedProducer:getState())

			local unsubscribe = combinedProducer:observe(
				selectPrivateCounterA,
				function(receivedCurrentState, receivedPreviousState)
					expect(receivedPreviousState).to.equal(previousState)
					expect(receivedCurrentState).to.equal(selectPrivateCounterA(combinedProducer:getState()))
				end
			)

			combinedProducer.privateIncrementA(1)
			combinedProducer:flush()
			unsubscribe()
		end)
	end)

	describe("CombinedProducer.setState", function()
		it("should set the state of the combined producer", function()
			local newState = {
				producerA = {
					sharedCounter = 1,
					privateCounter = 1,
				},
				producerB = {
					sharedCounter = 1,
					privateCounter = 1,
				},
			}

			combinedProducer:setState(newState)
			local state = combinedProducer:getState()

			-- Check shallow equality
			for key, value in pairs(newState) do
				expect(state[key]).to.equal(value)
			end
		end)
	end)

	describe("CombinedProducer.select", function()
		it("should select a part of the state", function()
			local function selectPrivateCounterA(state)
				return state.producerA.privateCounter
			end
			local actualState = selectPrivateCounterA(combinedProducer:getState())
			local selectedState = combinedProducer:select(selectPrivateCounterA)
			expect(selectedState).to.equal(actualState)
		end)
	end)

	describe("CombinedProducer.once", function()
		it("should call the listener once", function()
			local called = 0
			local unsubscribe = combinedProducer:once(function(state)
				return state.producerA.sharedCounter
			end, function()
				called = called + 1
			end)

			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
			unsubscribe()
			expect(called).to.equal(1)
		end)

		it("should not call the listener when the state does not change", function()
			local called = 0
			local unsubscribe = combinedProducer:once(function(state)
				return state.producerA.sharedCounter
			end, function()
				called = called + 1
			end)

			combinedProducer:flush()
			unsubscribe()
			expect(called).to.equal(0)
		end)
	end)

	describe("CombinedProducer.wait", function()
		it("should return a Promise", function()
			local promise = combinedProducer:wait(function()
				return true
			end)
			expect(promise).to.be.a("table")
			expect(promise.andThen).to.be.a("function")
			promise:cancel()
		end)

		it("should resolve when the selected state changes", function()
			local current = combinedProducer:getState()
			local promise = combinedProducer
				:wait(function(state)
					return state == current
				end)
				:andThen(function(isEqual)
					expect(isEqual).to.equal(false)
				end)
			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
		end)
	end)

	describe("CombinedProducer", function()
		it("should support Promise.fromEvent", function()
			expect(function()
				Promise.fromEvent(combinedProducer):cancel()
			end).never.to.throw()
		end)

		it("should resolve Promise.fromEvent when the state changes", function()
			local promise = Promise.fromEvent(combinedProducer)
			combinedProducer.sharedIncrement(1)
			combinedProducer:flush()
			local resolved, state = promise:await()
			expect(resolved).to.equal(true)
			expect(state).to.equal(combinedProducer:getState())
		end)
	end)
end
