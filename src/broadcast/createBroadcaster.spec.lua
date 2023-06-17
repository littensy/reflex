return function()
	local createProducer = require(script.Parent.Parent.createProducer)
	local combineProducers = require(script.Parent.Parent.combineProducers)
	local createBroadcaster = require(script.Parent.createBroadcaster)

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

	it("should return a broadcaster", function()
		local broadcaster = createBroadcaster({
			producers = producers,
			broadcast = function() end,
		})

		expect(broadcaster).to.be.a("table")
		expect(broadcaster.playerRequestedState).to.be.a("function")
		expect(broadcaster.middleware).to.be.a("function")
	end)

	it("should apply a safe middleware", function()
		local broadcaster = createBroadcaster({
			producers = producers,
			broadcast = function() end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		producer.incrementFoo(1)

		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(0)
	end)

	it("should call broadcast when dispatching", function()
		local players, pendingActions

		local broadcaster = createBroadcaster({
			producers = producers,
			broadcast = function(_players, _pendingActions)
				players = _players
				pendingActions = _pendingActions
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		expect(players).to.be.a("table")
		expect(#players).to.equal(0)

		expect(pendingActions).to.be.a("table")
		expect(#pendingActions).to.equal(2)

		expect(pendingActions[1]).to.be.a("table")
		expect(pendingActions[1].name).to.equal("incrementFoo")
		expect(pendingActions[1].arguments).to.be.a("table")
		expect(pendingActions[1].arguments[1]).to.equal(1)

		expect(pendingActions[2]).to.be.a("table")
		expect(pendingActions[2].name).to.equal("incrementBar")
		expect(pendingActions[2].arguments).to.be.a("table")
		expect(pendingActions[2].arguments[1]).to.equal(2)
	end)

	it("should exclude state and actions that are not provided", function()
		local pendingActions

		local broadcaster = createBroadcaster({
			producers = {
				foo = producers.foo,
			},
			broadcast = function(_players, _pendingActions)
				pendingActions = _pendingActions
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		-- pending actions should only contain incrementFoo
		expect(pendingActions).to.be.a("table")
		expect(#pendingActions).to.equal(1)

		-- state should only contain foo
		local state = broadcaster:playerRequestedState({})
		expect(state).to.be.a("table")
		expect(state.foo).to.be.a("table")
		expect(state.foo.count).to.equal(1)
		expect(state.bar).to.equal(nil)
	end)
end
