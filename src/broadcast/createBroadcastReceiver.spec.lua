return function()
	local createProducer = require(script.Parent.Parent.createProducer)
	local combineProducers = require(script.Parent.Parent.combineProducers)
	local createBroadcaster = require(script.Parent.createBroadcaster)
	local createBroadcastReceiver = require(script.Parent.createBroadcastReceiver)
	local hydrate = require(script.Parent.hydrate)

	local mockPlayer: Player = {} :: any
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

	afterEach(function()
		producer:destroy()
	end)

	it("should return a broadcast receiver", function()
		local receiver = createBroadcastReceiver({
			start = function() end,
		})

		expect(receiver).to.be.a("table")
		expect(receiver.middleware).to.be.a("function")
		expect(receiver.dispatch).to.be.a("function")
	end)

	it("should apply a safe middleware", function()
		local receiver = createBroadcastReceiver({
			start = function() end,
		})

		producer:applyMiddleware(receiver.middleware)
		producer.incrementFoo(1)

		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(0)
	end)

	it("should hydrate the producer with the server state", function()
		local receiver = createBroadcastReceiver({
			start = function() end,
		})

		producer:applyMiddleware(receiver.middleware)
		receiver:dispatch({
			hydrate.createHydrateAction({ foo = { count = 1 } }),
		})

		local state = producer:getState()
		expect(state.foo.count).to.equal(1)
		expect(state.bar.count).to.equal(0)

		state = producer.incrementFoo(1)
		expect(state.foo.count).to.equal(2)
		expect(state.bar.count).to.equal(0)
	end)

	it("should dispatch actions from the server", function()
		local receiver = createBroadcastReceiver({
			start = function() end,
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
		local clientProducer = producer
		local serverProducer = combineProducers(producers)
		local player, actions

		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function(...)
				player, actions = ...
			end,
		})

		local receiver = createBroadcastReceiver({
			start = function()
				broadcaster:start(mockPlayer)
			end,
		})

		-- Set the state to something other than the default
		clientProducer:setState({
			foo = { count = -1 },
			bar = { count = -1 },
		})

		serverProducer:applyMiddleware(broadcaster.middleware)
		clientProducer:applyMiddleware(receiver.middleware)

		-- Manually hydrate the state
		receiver:dispatch(actions)
		local state = clientProducer:getState()
		expect(state.foo.count).to.equal(0)
		expect(state.bar.count).to.equal(0)

		serverProducer.incrementFoo(1)
		serverProducer.incrementBar(2)

		broadcaster:flush()

		expect(player).to.equal(mockPlayer)
		expect(#actions).to.equal(2)

		local actionA, actionB = table.unpack(actions)
		expect(actionA.name).to.equal("incrementFoo")
		expect(actionA.arguments[1]).to.equal(1)
		expect(actionB.name).to.equal("incrementBar")
		expect(actionB.arguments[1]).to.equal(2)

		local stateBeforeDispatch = clientProducer:getState()
		expect(stateBeforeDispatch.foo.count).to.equal(0)
		expect(stateBeforeDispatch.bar.count).to.equal(0)

		receiver:dispatch(actions)

		local stateAfterDispatch = clientProducer:getState()
		expect(stateAfterDispatch.foo.count).to.equal(1)
		expect(stateAfterDispatch.bar.count).to.equal(2)
	end)
end
