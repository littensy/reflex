return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local initialState = { count = 0 }
	local producer

	beforeEach(function()
		producer = createProducer(initialState, {
			increment = function(state, amount)
				return { count = state.count + amount }
			end,
		})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should reset the state to the initial state", function()
		producer.increment(1)
		producer:resetState()
		expect(producer:getState()).to.equal(initialState)
	end)

	it("should trigger a state update if state changed", function()
		local stateChanged = false
		producer.increment(1)
		producer:flush()
		producer:subscribe(function()
			stateChanged = true
		end)
		producer:resetState()
		producer:flush()
		expect(stateChanged).to.equal(true)
	end)
end
