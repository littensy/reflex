return function()
	local Promise = require(game:GetService("ReplicatedStorage").include.Promise)
	local createProducer = require(script.Parent.Parent["create-producer"]).createProducer
	local combineProducers = require(script.Parent.Parent["combine-producers"]).combineProducers
	local applyMiddleware = require(script.Parent.Parent["apply-middleware"]).applyMiddleware
	local createBroadcaster = require(script.Parent["broadcaster"]).createBroadcaster
	local createBroadcastReceiver = require(script.Parent["broadcast-receiver"]).createBroadcastReceiver

	local function copyProducerMap()
		return {
			a = createProducer({ count = 0 }, {
				incrementA = function(state, amount)
					return { count = state.count + amount }
				end,
			}),
			b = createProducer({ count = 0 }, {
				incrementB = function(state, amount)
					return { count = state.count + amount }
				end,
			}),
		}
	end

	describe("createBroadcastReceiver", function()
		it("should return a broadcast receiver", function()
			local broadcastReceiver = createBroadcastReceiver({
				producers = copyProducerMap(),
				broadcast = function() end,
			})

			expect(broadcastReceiver).to.be.a("table")
			expect(broadcastReceiver.enhancer).to.be.a("function")
			expect(broadcastReceiver.dispatch).to.be.a("function")
		end)
	end)

	describe("BroadcastReceiver", function()
		it("should have an enhancer function", function()
			local producerMap = copyProducerMap()

			local broadcastReceiver = createBroadcastReceiver({
				getServerState = function()
					return Promise.resolve({})
				end,
			})

			expect(function()
				combineProducers(producerMap):enhance(broadcastReceiver.enhancer)
			end).never.to.throw()
		end)

		it("should hydrate the initial state with the server state", function()
			local producerMap = copyProducerMap()

			local broadcastReceiver = createBroadcastReceiver({
				getServerState = function()
					return Promise.resolve({ a = { count = 10 } })
				end,
			})

			local producer = combineProducers(producerMap):enhance(broadcastReceiver.enhancer)
			local state = producer:getState()

			expect(state.a.count).to.equal(10)
			expect(state.b.count).to.equal(0)

			local newState = producer.incrementA(1)

			expect(newState.a.count).to.equal(11)
			expect(newState.b.count).to.equal(0)
		end)

		it("should dispatch actions from the server", function()
			local producerMap = copyProducerMap()

			local broadcastReceiver = createBroadcastReceiver({
				getServerState = function()
					return Promise.resolve({})
				end,
			})

			local producer = combineProducers(producerMap):enhance(broadcastReceiver.enhancer)

			broadcastReceiver.dispatch({
				{ type = "incrementA", arguments = { 10 } },
				{ type = "incrementB", arguments = { 20 } },
			})

			local state = producer:getState()

			expect(state.a.count).to.equal(10)
			expect(state.b.count).to.equal(20)
		end)

		it("should receive updates from the broadcaster", function()
			local producerMapServer = copyProducerMap()
			local producerMapClient = copyProducerMap()

			local incomingActions, producerClient, producerServer

			local broadcaster = createBroadcaster({
				producers = producerMapServer,
				broadcast = function(players, actions)
					incomingActions = actions
				end,
			})

			local broadcastReceiver = createBroadcastReceiver({
				getServerState = function()
					return Promise.resolve(producerServer:getState())
				end,
			})

			producerServer = combineProducers(producerMapServer):enhance(applyMiddleware(broadcaster.middleware))
			producerClient = combineProducers(producerMapClient):enhance(broadcastReceiver.enhancer)

			producerServer.incrementA(10)
			producerServer.incrementB(20)

			-- dispatches are deferred until the next frame
			task.defer(function()
				local oldClientState = producerClient:getState()

				expect(incomingActions).to.be.a("table")
				expect(#incomingActions).to.equal(2)

				local actionA, actionB = unpack(incomingActions)

				expect(actionA.type).to.equal("incrementA")
				expect(actionA.arguments[1]).to.equal(10)
				expect(actionB.type).to.equal("incrementB")
				expect(actionB.arguments[1]).to.equal(20)

				broadcastReceiver.dispatch(incomingActions)

				local newClientState = producerClient:getState()

				expect(newClientState.a.count).to.equal(oldClientState.a.count + 10)
				expect(newClientState.b.count).to.equal(oldClientState.b.count + 20)
			end)
		end)
	end)
end
