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

	it("should call middleware with the right parameters", function()
		local producer = copyProducer()

		local function middleware(dispatch, resolve, _producer)
			expect(dispatch).to.be.a("function")
			expect(resolve).to.be.a("function")
			expect(_producer).to.equal(producer)
			return function(...)
				expect(...).to.be.a("number")
				return dispatch(...)
			end
		end

		producer.enhance(applyMiddleware(middleware))
		producer.increment(1)
		producer.destroy()
	end)

	it("should call middleware in order", function()
		local producer = copyProducer()

		local middlewareCalls = {}

		local function middleware1(dispatch, resolve, _producer)
			return function(...)
				table.insert(middlewareCalls, 1)
				return dispatch(...)
			end
		end

		local function middleware2(dispatch, resolve, _producer)
			return function(...)
				table.insert(middlewareCalls, 2)
				return dispatch(...)
			end
		end

		local function middleware3(dispatch, resolve, _producer)
			return function(...)
				table.insert(middlewareCalls, 3)
				return dispatch(...)
			end
		end

		producer.enhance(applyMiddleware(middleware1, middleware2, middleware3))
		producer.increment(1)
		producer.destroy()

		expect(middlewareCalls).to.be.a("table")
		expect(#middlewareCalls).to.equal(3)
		expect(middlewareCalls[1]).to.equal(1)
		expect(middlewareCalls[2]).to.equal(2)
		expect(middlewareCalls[3]).to.equal(3)
	end)

	it("should return what the middleware returns", function()
		local producer = copyProducer()

		local function middleware(dispatch, resolve, _producer)
			return function(...)
				dispatch(...)
				return "middleware"
			end
		end

		producer.enhance(applyMiddleware(middleware))
		local result = producer.increment(1)
		producer.destroy()

		expect(result).to.equal("middleware")
	end)
end
