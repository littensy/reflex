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

	it("should set the state", function()
		local state = { count = 1 }
		producer:setState(state)
		expect(producer:getState()).to.equal(state)
	end)

	it("should schedule a flush", function()
		local thread = coroutine.running()

		task.delay(0.1, function()
			if thread then
				coroutine.resume(thread, "flush took too long")
			end
		end)

		producer:subscribe(function(state)
			coroutine.resume(thread, true)
			thread = nil
		end)

		producer:setState({ count = 1 })

		local ok = coroutine.yield()
		expect(ok).to.equal(true)
	end)
end
