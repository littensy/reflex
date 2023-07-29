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
			dispatch = function() end,
		})

		expect(broadcaster).to.be.a("table")
		expect(broadcaster.start).to.be.a("function")
		expect(broadcaster.middleware).to.be.a("function")
	end)

	it("should apply a safe middleware", function()
		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function() end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		producer.incrementFoo(1)

		expect(producer:getState().foo.count).to.equal(1)
		expect(producer:getState().bar.count).to.equal(0)
	end)

	it("should hydrate the player on start", function()
		local player, actions

		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function(...)
				player, actions = ...
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:start(mockPlayer)

		expect(player).to.equal(mockPlayer)
		expect(actions).to.be.a("table")
		expect(#actions).to.equal(1)

		expect(actions[1].name).to.equal("__hydrate__")
		expect(actions[1].arguments[1]).to.be.a("table")
		expect(actions[1].arguments[1].foo).to.be.a("table")
		expect(actions[1].arguments[1].foo.count).to.equal(0)
		expect(actions[1].arguments[1].bar).to.be.a("table")
		expect(actions[1].arguments[1].bar.count).to.equal(0)
	end)

	it("should call dispatch function", function()
		local player, actions

		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function(...)
				player, actions = ...
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:start(mockPlayer)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		expect(player).to.equal(mockPlayer)
		expect(actions).to.be.a("table")
		expect(#actions).to.equal(2)

		expect(actions[1].name).to.equal("incrementFoo")
		expect(actions[1].arguments[1]).to.equal(1)

		expect(actions[2].name).to.equal("incrementBar")
		expect(actions[2].arguments[1]).to.equal(2)
	end)

	it("should exclude state and actions that are not provided", function()
		local actions, hydrateState

		local broadcaster = createBroadcaster({
			producers = {
				foo = producers.foo,
			},
			dispatch = function(player, _actions)
				actions = _actions
				hydrateState = hydrateState or actions[1].arguments[1]
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:start(mockPlayer)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		-- initial state should only contain foo
		expect(hydrateState).to.be.a("table")
		expect(hydrateState.foo).to.be.a("table")
		expect(hydrateState.foo.count).to.equal(0)
		expect(hydrateState.bar).to.equal(nil)

		-- pending actions should only contain incrementFoo
		expect(#actions).to.equal(1)
		expect(actions[1].name).to.equal("incrementFoo")
		expect(actions[1].arguments[1]).to.equal(1)
	end)

	it("should receive a beforeHydrate option", function()
		local state, player

		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function(player, actions)
				state = actions[1].arguments[1]
			end,
			beforeHydrate = function(_player, state)
				player = _player
				return {
					foo = state.foo,
					bar = nil,
				}
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:start(mockPlayer)

		expect(player).to.equal(mockPlayer)
		expect(state).to.be.ok()
		expect(state.foo).to.be.ok()
		expect(state.foo.count).to.equal(0)
		expect(state.bar).to.never.be.ok()
	end)

	it("should receive a beforeDispatch function", function()
		local actions, player

		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function(player, _actions)
				actions = _actions
			end,
			beforeDispatch = function(_player, action)
				player = _player
				return if action.name == "incrementFoo" then action else nil
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:start(mockPlayer)
		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		expect(player).to.equal(mockPlayer)
		expect(actions).to.be.a("table")
		expect(#actions).to.equal(1)
		expect(actions[1].name).to.equal("incrementFoo")
		expect(actions[1].arguments[1]).to.equal(1)
	end)

	it("should accept a hydrate function", function()
		local actions, state, player

		local broadcaster = createBroadcaster({
			producers = producers,
			dispatch = function(...)
				player, actions = ...
			end,
			hydrate = function(...)
				player, state = ...
			end,
		})

		producer:applyMiddleware(broadcaster.middleware)
		broadcaster:start(mockPlayer)

		expect(player).to.equal(mockPlayer)
		expect(state).to.be.a("table")
		expect(state.foo.count).to.equal(0)
		expect(state.bar.count).to.equal(0)
		expect(actions).to.never.be.ok()

		producer.incrementFoo(1)
		producer.incrementBar(2)
		broadcaster:flush()

		expect(actions).to.be.a("table")
		expect(actions[1].name).to.equal("incrementFoo")
		expect(actions[2].name).to.equal("incrementBar")
	end)
end
