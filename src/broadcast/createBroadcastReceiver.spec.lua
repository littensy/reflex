return function()
	local Promise = require(script.Parent.Parent.Promise)
	local createProducer = require(script.Parent.Parent.createProducer)
	local combineProducers = require(script.Parent.Parent.combineProducers)
	local createBroadcaster = require(script.Parent.createBroadcaster)
	local createBroadcastReceiver = require(script.Parent.createBroadcastReceiver)

	local producers, producer

	beforeEach(function()
		producers = {
			foo = createProducer({ count = 0 }, {
				incrementFoo = function(state, amount)
					return { count = state.count + amount }
				end,
			}),
			bar = createProducer({ count = 0 }, {
				incrementBar = function(state, amount)
					return { count = state.count + amount }
				end,
			}),
		}

		producer = combineProducers(producers)
	end)

	it("should return a broadcast receiver", function()
		local receiver = createBroadcastReceiver({
			producers = producers,
			requestState = function()
				return Promise.resolve({})
			end,
		})

		expect(receiver).to.be.a("table")
		expect(receiver.middleware).to.be.a("function")
		expect(receiver.dispatch).to.be.a("function")
	end)

	it("should apply a safe middleware", function()
		local receiver = createBroadcastReceiver({
			producers = producers,
			requestState = function()
				return Promise.resolve({})
			end,
		})

		producer:applyMiddleware(receiver.middleware)
		producer.incrementFoo(1)

		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(0)
	end)

	it("should hydrate the producer with the server state", function()
		local receiver = createBroadcastReceiver({
			producers = producers,
			requestState = function()
				return Promise.resolve({ foo = { count = 1 } })
			end,
		})

		producer:applyMiddleware(receiver.middleware)

		local state = producer:getState()
		expect(state.foo.count).to.equal(1)
		expect(state.bar.count).to.equal(0)

		state = producer.incrementFoo(1)
		expect(state.foo.count).to.equal(2)
		expect(state.bar.count).to.equal(0)
	end)

	it("should dispatch actions from the server", function()
		local receiver = createBroadcastReceiver({
			producers = producers,
			requestState = function()
				return Promise.resolve({})
			end,
		})

		producer:applyMiddleware(receiver.middleware)

		receiver:dispatch({
			{ name = "incrementFoo", arguments = { 1 } },
			{ name = "incrementBar", arguments = { 2 } },
			{ name = "incrementBaz", arguments = { 3 } },
		})

		local state = producer:getState()
		expect(state.foo.count).to.equal(1)
		expect(state.bar.count).to.equal(2)
	end)

	it("should receive updates from a broadcaster", function()
		local thread = coroutine.running()
		local pendingActions

		local clientProducer = producer
		local serverProducer = combineProducers(producers)

		local broadcaster = createBroadcaster({
			producers = producers,
			broadcast = function(_players, _pendingActions)
				pendingActions = _pendingActions
				coroutine.resume(thread)
			end,
		})

		local receiver = createBroadcastReceiver({
			requestState = function()
				return Promise.resolve(serverProducer:getState())
			end,
		})

		-- Set the state to something other than the default
		clientProducer:setState({
			foo = { count = -1 },
			bar = { count = -1 },
		})

		clientProducer:applyMiddleware(receiver.middleware)
		serverProducer:applyMiddleware(broadcaster.middleware)

		serverProducer.incrementFoo(1)
		serverProducer.incrementBar(2)

		task.delay(0.1, function()
			if thread then
				coroutine.resume(thread, "broadcast took too long")
			end
		end)

		expect(coroutine.yield()).to.equal(nil)
		thread = nil

		expect(pendingActions).to.be.a("table")
		expect(#pendingActions).to.equal(2)

		local actionA, actionB = table.unpack(pendingActions)

		expect(actionA.name).to.equal("incrementFoo")
		expect(actionA.arguments[1]).to.equal(1)
		expect(actionB.name).to.equal("incrementBar")
		expect(actionB.arguments[1]).to.equal(2)

		local stateBeforeDispatch = clientProducer:getState()
		expect(stateBeforeDispatch.foo.count).to.equal(0)
		expect(stateBeforeDispatch.bar.count).to.equal(0)

		receiver:dispatch(pendingActions)

		local stateAfterDispatch = clientProducer:getState()
		expect(stateAfterDispatch.foo.count).to.equal(1)
		expect(stateAfterDispatch.bar.count).to.equal(2)
	end)
end
