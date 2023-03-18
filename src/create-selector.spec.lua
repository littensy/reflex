return function()
	local createSelector = require(script.Parent["create-selector"]).createSelector

	local selectorA = function(state)
		return state.A
	end

	local selectorB = function(state)
		return state.B
	end

	local selector, result

	describe("createSelector", function()
		it("should return a function", function()
			selector = createSelector({ selectorA, selectorB }, function(a, b)
				return { a + b }
			end)

			expect(selector).to.be.a("function")
		end)
	end)

	describe("selector", function()
		it("should return the correct value", function()
			result = selector({ A = 1, B = 2 })

			expect(result).to.be.a("table")
			expect(result[1]).to.equal(3)
		end)

		it("should return the same value if the state hasn't changed", function()
			local newResult = selector({ A = 1, B = 2 })

			expect(newResult).to.equal(result)
		end)

		it("should return a new value if the state has changed", function()
			local newResult = selector({ A = 1, B = 3 })

			expect(newResult).never.to.equal(result)
			expect(newResult[1]).to.equal(4)
		end)

		it("should not call the selector if the state hasn't changed", function()
			local called = false

			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				called = true
				return { a + b }
			end)

			selector({ A = 1, B = 123 })
			expect(called).to.equal(true)

			called = false
			selector({ A = 1, B = 123 })
			expect(called).to.equal(false)
		end)
	end)
end
