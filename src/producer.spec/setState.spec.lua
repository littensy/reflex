return function()
	local createProducer = require(script.Parent.Parent.createProducer)

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

	it("should set the state", function()
		local state = { count = 1 }
		producer:setState(state)
		expect(producer:getState()).to.equal(state)
	end)

	it("should schedule a flush", function()
		local thread = coroutine.running()

		producer:subscribe(function(state)
			coroutine.resume(thread)
		end)

		producer:setState({ count = 1 })

		task.delay(1, function()
			if thread then
				coroutine.resume(thread, "flush took too long")
			end
		end)

		expect(coroutine.yield()).to.equal(nil)
		thread = nil
	end)
end
