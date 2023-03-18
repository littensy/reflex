return function()
	local createProducer = require(script.Parent["create-producer"]).createProducer
	local applyMiddleware = require(script.Parent["apply-middleware"]).applyMiddleware

	local function copyProducer()
		return createProducer({ value = 0 }, {
			increment = function(state, amount)
				return { value = state.value + amount }
			end,
		})
	end

	it("should call middleware with a key and args", function()
		local producer = copyProducer()
		local contextReceived = {} -- { "increment", amount }

		local middleware = function(store)
			return function(done)
				return function(context)
					contextReceived = context
					return done(context)
				end
			end
		end

		producer:enhance(applyMiddleware(middleware))

		producer.increment(5)

		expect(contextReceived.type).to.equal("increment")
		expect(contextReceived.arguments[1]).to.equal(5)
		expect(producer:getState().value).to.equal(5)

		producer:destroy()
	end)

	it("should call middleware in order", function()
		local producer = copyProducer()
		local middlewareCalls = {} -- { "increment", amount }

		local middleware1 = function(store)
			return function(done)
				return function(context)
					table.insert(middlewareCalls, "middleware1")
					return done(context)
				end
			end
		end

		local middleware2 = function(store)
			return function(done)
				return function(context)
					table.insert(middlewareCalls, "middleware2")
					return done(context)
				end
			end
		end

		producer:enhance(applyMiddleware(middleware1, middleware2))

		producer.increment(5)

		expect(middlewareCalls[1]).to.equal("middleware1")
		expect(middlewareCalls[2]).to.equal("middleware2")
		expect(producer:getState().value).to.equal(5)

		producer:destroy()
	end)

	it("should return what the middleware returns", function()
		local producer = copyProducer()

		local middleware = function(store)
			return function(done)
				return function(context)
					done(context)
					return "middleware"
				end
			end
		end

		producer:enhance(applyMiddleware(middleware))

		local result = producer.increment(5)

		expect(result).to.equal("middleware")
		expect(producer:getState().value).to.equal(5)

		producer:destroy()
	end)
end
