return function()
	local createSelector = require(script.Parent.createSelector)

	local function selectFoo(state)
		return state.foo
	end

	local function selectBar(state)
		return state.bar
	end

	it("should return a function", function()
		local selector = createSelector({ selectFoo }, function() end)
		expect(selector).to.be.a("function")
	end)

	it("should return the selected state", function()
		local selector = createSelector({ selectFoo, selectBar }, function(foo, bar)
			return foo .. bar
		end)
		expect(selector({ foo = 1, bar = 2 })).to.equal("12")
	end)

	it("should memoize the result by comparing arguments", function()
		local selector = createSelector({ selectFoo, selectBar }, function(foo, bar)
			return {}
		end)
		local state = { foo = 1, bar = 2 }
		expect(selector(state)).to.equal(selector(state))
		expect(selector(state)).to.never.equal(selector({ foo = 3, bar = 4 }))
	end)

	it("should memoize the result by comparing dependencies", function()
		local selector = createSelector({ selectFoo, selectBar }, function(foo, bar)
			return {}
		end)
		expect(selector({ foo = 1, bar = 2 })).to.equal(selector({ foo = 1, bar = 2 }))
		expect(selector({ foo = 1, bar = 2 })).to.never.equal(selector({ foo = 3, bar = 4 }))
	end)

	it("should not call a dependency unless arguments have changed", function()
		local calls = 0

		local function dependency(state)
			calls += 1
			return state.foo
		end

		local selector = createSelector({ dependency }, function(foo)
			return foo
		end)

		local state = { foo = 1 }

		selector(state)
		selector(state)
		expect(calls).to.equal(1)

		selector({ foo = 1 })
		expect(calls).to.equal(2)
	end)

	it("should not call the selector unless dependencies have changed", function()
		local calls = 0

		local selector = createSelector({ selectFoo, selectBar }, function(foo, bar)
			calls += 1
		end)

		local state = { foo = 1, bar = 2 }

		selector(state)
		selector(state) -- should not call deps
		expect(calls).to.equal(1)

		selector({ foo = 1, bar = 2 }) -- should call deps, but not selector
		expect(calls).to.equal(1)

		selector({ foo = 3, bar = 4 }) -- should call deps and selector
		expect(calls).to.equal(2)
	end)

	it("should allow nil dependencies and keep order", function()
		local selector = createSelector({ selectFoo, selectBar }, function(foo, bar)
			return (foo or "nil") .. (bar or "nil")
		end)
		expect(selector({ foo = 1, bar = 2 })).to.equal("12")
		expect(selector({ foo = 1 })).to.equal("1nil")
		expect(selector({ foo = 1, bar = 2 })).to.equal("12")
		expect(selector({ bar = 2 })).to.equal("nil2")
		expect(selector({})).to.equal("nilnil")
		expect(selector({ foo = 1, bar = 2 })).to.equal("12")
	end)

	it("should allow nil arguments and keep order", function()
		local calls = 0
		local value

		local function dependency(a, b, c)
			return (a or "nil") .. (b or "nil") .. (c or "nil")
		end

		local selector = createSelector({ dependency }, function(value)
			calls += 1
			return value
		end)

		-- two calls with nil arguments should trigger one call
		value = selector()
		selector()
		expect(value).to.equal("nilnilnil")
		expect(calls).to.equal(1)

		-- an argument going from nil to non-nil should trigger a call
		value = selector(nil, 1, nil)
		selector(nil, 1, nil)
		expect(value).to.equal("nil1nil")
		expect(calls).to.equal(2)

		-- an argument going from non-nil to nil should trigger a call
		value = selector(nil, nil, nil)
		selector(nil, nil, nil)
		expect(value).to.equal("nilnilnil")
		expect(calls).to.equal(3)

		-- the location of the nil argument should not matter
		value = selector(1, nil, 1)
		selector(1, nil, 1)
		expect(value).to.equal("1nil1")
		expect(calls).to.equal(4)

		value = selector(1, 1, nil)
		selector(1, 1, nil)
		expect(value).to.equal("11nil")
		expect(calls).to.equal(5)
	end)

	it("should receive an equalityCheck option", function()
		local current, previous

		local selector = createSelector({ selectFoo }, function(foo)
			return { value = foo.value }
		end, {
			equalityCheck = function(a, b)
				return a.value == b.value
			end,
		})

		current, previous = selector({ foo = { value = 1 } }), nil
		expect(current).to.be.a("table")
		expect(current.value).to.equal(1)

		current, previous = selector({ foo = { value = 1 } }), current
		expect(current).to.equal(previous)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.never.equal(previous)
		expect(current.value).to.equal(2)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.equal(previous)
	end)

	it("should receive a resultEqualityCheck option", function()
		local current, previous

		local selector = createSelector({ selectFoo }, function(foo)
			return { value = foo.value }
		end, {
			resultEqualityCheck = function(a, b)
				return a.value == b.value
			end,
		})

		current, previous = selector({ foo = { value = 1 } }), nil
		expect(current).to.be.a("table")
		expect(current.value).to.equal(1)

		current, previous = selector({ foo = { value = 1 } }), current
		expect(current).to.equal(previous)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.never.equal(previous)
		expect(current.value).to.equal(2)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.equal(previous)
	end)

	it("should receive an equalityCheck as options", function()
		local current, previous

		local selector = createSelector({ selectFoo }, function(foo)
			return { value = foo.value }
		end, function(a, b)
			return a.value == b.value
		end)

		current, previous = selector({ foo = { value = 1 } }), nil
		expect(current).to.be.a("table")
		expect(current.value).to.equal(1)

		current, previous = selector({ foo = { value = 1 } }), current
		expect(current).to.equal(previous)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.never.equal(previous)
		expect(current.value).to.equal(2)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.equal(previous)
	end)

	it("should receive dependencies directly as parameters", function()
		local current, previous

		local selector = createSelector(selectFoo, selectBar, function(foo, bar)
			return { value = foo + bar }
		end)

		current, previous = selector({ foo = 1, bar = 1 }), nil
		expect(current).to.be.a("table")
		expect(current.value).to.equal(2)

		current, previous = selector({ foo = 1, bar = 1 }), current
		expect(current).to.equal(previous)

		current, previous = selector({ foo = 2, bar = 1 }), current
		expect(current).to.never.equal(previous)
		expect(current.value).to.equal(3)

		current, previous = selector({ foo = 2, bar = 1 }), current
		expect(current).to.equal(previous)

		current, previous = selector({ foo = 2, bar = 2 }), current
		expect(current).to.never.equal(previous)
		expect(current.value).to.equal(4)
	end)

	it("should receive equality options when passing dependencies directly", function()
		local current, previous

		local selector = createSelector(selectFoo, selectBar, function(foo, bar)
			return { value = foo.value }
		end, {
			resultEqualityCheck = function(a, b)
				return a.value == b.value
			end,
		})

		current, previous = selector({ foo = { value = 1 } }), nil
		expect(current).to.be.a("table")
		expect(current.value).to.equal(1)

		current, previous = selector({ foo = { value = 1 } }), current
		expect(current).to.equal(previous)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.never.equal(previous)
		expect(current.value).to.equal(2)

		current, previous = selector({ foo = { value = 2 } }), current
		expect(current).to.equal(previous)
	end)
end
