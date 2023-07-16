return function()
	local createProducer = require(script.Parent.Parent.createProducer)
	local combineProducers = require(script.Parent.Parent.combineProducers)
	local createBroadcaster = require(script.Parent.createBroadcaster)

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
		local actionsPerPlayer

		local broadcaster = createBroadcaster({
			producers = producers,
			broadcast = function(_actionsPerPlayer)
				actionsPerPlayer = _actionsPerPlayer
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:playerRequestedState(mockPlayer)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		expect(actionsPerPlayer).to.be.a("table")
		expect(actionsPerPlayer[mockPlayer]).to.be.a("table")
		expect(#actionsPerPlayer[mockPlayer]).to.equal(2)

		expect(actionsPerPlayer[mockPlayer][1]).to.be.a("table")
		expect(actionsPerPlayer[mockPlayer][1].name).to.equal("incrementFoo")
		expect(actionsPerPlayer[mockPlayer][1].arguments).to.be.a("table")
		expect(actionsPerPlayer[mockPlayer][1].arguments[1]).to.equal(1)

		expect(actionsPerPlayer[mockPlayer][2]).to.be.a("table")
		expect(actionsPerPlayer[mockPlayer][2].name).to.equal("incrementBar")
		expect(actionsPerPlayer[mockPlayer][2].arguments).to.be.a("table")
		expect(actionsPerPlayer[mockPlayer][2].arguments[1]).to.equal(2)
	end)

	it("should exclude state and actions that are not provided", function()
		local actionsPerPlayer

		local broadcaster = createBroadcaster({
			producers = {
				foo = producers.foo,
			},
			broadcast = function(_actionsPerPlayer)
				actionsPerPlayer = _actionsPerPlayer
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:playerRequestedState(mockPlayer)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		-- pending actions should only contain incrementFoo
		expect(#actionsPerPlayer[mockPlayer]).to.equal(1)

		-- state should only contain foo
		local state = broadcaster:playerRequestedState(mockPlayer)
		expect(state).to.be.a("table")
		expect(state.foo).to.be.a("table")
		expect(state.foo.count).to.equal(1)
		expect(state.bar).to.equal(nil)
	end)
end
