return function()
	local createProducer = require(script.Parent.createProducer)
	local applyMiddleware = require(script.Parent.applyMiddleware)

	local producer

	beforeEach(function()
		producer = createProducer({ count = 0 }, {
			increment = function(state, amount)
				return { count = state.count + amount }
			end,
		})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should call middleware with the right parameters", function()
		local function middleware(_producer)
			expect(_producer).to.equal(producer)

			return function(dispatch, name)
				expect(dispatch).to.be.a("function")
				expect(producer[name]).to.equal(dispatch)

				return function(...)
					expect(name).to.equal("increment")
					expect(select("#", ...)).to.equal(2)
					expect(select(1, ...)).to.equal(1)
					expect(select(2, ...)).to.equal(2)

					return dispatch(...)
				end
			end
		end

		applyMiddleware(middleware)(producer)
		expect(producer.increment(1, 2)).to.equal(producer:getState())
	end)

	it("should call middleware in order", function()
		local order = ""

		local function create(index)
			return function(producer)
				return function(dispatch)
					return function(...)
						order ..= index
						return dispatch(...)
					end
				end
			end
		end

		applyMiddleware(create(1), create(2), create(3))(producer)
		producer.increment(1)

		expect(order).to.equal("123")
	end)

	it("should pass forward the result of the middleware", function()
		local function middleware(producer)
			return function(dispatch)
				return function(...)
					dispatch(...)
					return 1
				end
			end
		end

		applyMiddleware(middleware)(producer)
		expect(producer.increment(1)).to.equal(1)
	end)
end
