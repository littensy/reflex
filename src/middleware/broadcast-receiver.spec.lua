return function()
	local Promise = require(game:GetService("ReplicatedStorage").include.Promise)
	local createProducer = require(script.Parent.Parent["create-producer"]).createProducer
	local combineProducers = require(script.Parent.Parent["combine-producers"]).combineProducers
	local applyMiddleware = require(script.Parent.Parent["apply-middleware"]).applyMiddleware
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
	end)
end
