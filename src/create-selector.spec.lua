return function()
	local createSelector = require(script.Parent["create-selector"]).createSelector

	local selectorA = function(state)
		return state.A
	end

	local selectorB = function(state)
		return state.B
	end

	describe("createSelector", function()
		it("should return a function", function()
			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				return a + b
			end)

			expect(selector).to.be.a("function")
		end)
	end)

	describe("selector", function()
		it("should return the correct value", function()
			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				return a + b
			end)

			expect(selector({ A = 1, B = 1 })).to.equal(2)
			expect(selector({ A = 2, B = 2 })).to.equal(4)
		end)

		it("should return the same value if the state hasn't changed", function()
			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				return {}
			end)

			local result = selector({ A = 1, B = 1 })
			expect(selector({ A = 1, B = 1 })).to.equal(result)
		end)

		it("should return a new value if the state has changed", function()
			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				return {}
			end)

			local result = selector({ A = 1, B = 1 })
			expect(selector({ A = 2, B = 2 })).never.to.equal(result)
		end)

		it("should not call the selector if the state hasn't changed", function()
			local called = false

			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				called = true
				return a + b
			end)

			selector({ A = 1, B = 123 })
			expect(called).to.equal(true)

			called = false
			selector({ A = 1, B = 123 })
			expect(called).to.equal(false)
		end)

		it("should update if a dependency changes to nil", function()
			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				return (a or 0) + (b or 0)
			end)

			expect(selector({ A = 1, B = 1 })).to.equal(2)
			expect(selector({ A = 1 })).to.equal(1)
			expect(selector({ B = 1 })).to.equal(1)
			expect(selector({ A = 2, B = 2 })).to.equal(4)
		end)

		it("should set a dependency to nil if it is removed from the state", function()
			local callCount = 0

			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				callCount += 1

				if callCount == 1 then
					expect(a).to.equal(1)
					expect(b).to.equal(1)
				elseif callCount == 2 then
					expect(a).to.equal(1)
					expect(b).to.equal(nil)
				elseif callCount == 3 then
					expect(a).to.equal(1)
					expect(b).to.equal(2)
				else
					error("Called too many times")
				end

				return {}
			end)

			selector({ A = 1, B = 1 })
			selector({ A = 1 })
			selector({ A = 1, B = 2 })
		end)

		it("should support dependencies that return nil", function()
			local resultA, resultB
			local selector = createSelector({ selectorA, selectorB }, function(a, b)
				resultA = a
				resultB = b
			end)

			selector({ B = 2 })
			expect(resultA).to.equal(nil)
			expect(resultB).to.equal(2)

			selector({ A = 1, B = 2 })
			expect(resultA).to.equal(1)
			expect(resultB).to.equal(2)
		end)

		it("should support nil arguments", function()
			local argumentA, argumentB, argumentC
			local callCount = 0
			local function selector(a, b, c)
				argumentA = a
				argumentB = b
				argumentC = c
				return (a or 0) + (b or 0)
			end

			local memoizedSelector = createSelector({ selector }, function()
				callCount += 1
			end)

			-- being called with nil arguments twice shouldn't trigger a call
			memoizedSelector()
			expect(argumentA).to.equal(nil)
			expect(argumentB).to.equal(nil)
			expect(callCount).to.equal(1)

			memoizedSelector()
			expect(callCount).to.equal(1)

			-- an argument changing from nil to a value should trigger a call
			memoizedSelector(nil, 1)
			expect(argumentA).to.equal(nil)
			expect(argumentB).to.equal(1)
			expect(callCount).to.equal(2)

			-- an argument changing from a value to nil should trigger a call
			memoizedSelector()
			expect(argumentA).to.equal(nil)
			expect(argumentB).to.equal(nil)
			expect(callCount).to.equal(3)

			-- the location of the nil argument shouldn't matter
			memoizedSelector(1, nil, 1)
			memoizedSelector(1, 1, nil)
			expect(argumentA).to.equal(1)
			expect(argumentB).to.equal(1)
			expect(argumentC).to.equal(nil)
			expect(callCount).to.equal(5)
		end)
	end)
end
