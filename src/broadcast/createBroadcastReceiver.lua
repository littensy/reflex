local Promise = require(script.Parent.Parent.Promise)
local types = require(script.Parent.Parent.types)
local setInterval = require(script.Parent.Parent.utils.setInterval)

--[=[
	Creates a broadcast receiver object that can be used to dispatch actions
	broadcasted by the server.
	@param options The options for the broadcast receiver.
	@return The broadcast receiver.
]=]
local function createBroadcastReceiver(options: types.BroadcastReceiverOptions): types.BroadcastReceiver
	local requestState = options.requestState
	local requestInterval = options.requestInterval or 5

	local receiver = {} :: types.BroadcastReceiver
	local rootProducer: types.Producer?

	-- If the request for state takes too long, actions may be dispatched
	-- before the state is hydrated. In this case, we queue the actions
	-- and dispatch them once the server's state has been received.
	local queue: { () -> () } = {}
	local shouldQueue = true

	local function merge(state)
		assert(rootProducer, "Failed to apply receiver middleware")

		local nextState = table.clone(rootProducer:getState())

		for key, value in state do
			nextState[key] = value
		end

		rootProducer:setState(nextState)

		if shouldQueue then
			shouldQueue = false

			for _, dispatch in queue do
				task.spawn(dispatch)
			end

			table.clear(queue)
		end
	end

	local function requestMerge()
		local value = requestState()

		if Promise.is(value) then
			value:andThen(merge)
		else
			merge(value)
		end
	end

	function receiver:dispatch(actions: { types.BroadcastAction })
		assert(rootProducer, "Cannot dispatch actions before the middleware is applied")

		local dispatchers = rootProducer:getDispatchers()

		for _, action in actions do
			local dispatcher = dispatchers[action.name]

			if not dispatcher then
				continue
			end

			if shouldQueue then
				table.insert(queue, function()
					dispatcher(table.unpack(action.arguments))
				end)
			end

			-- Dispatch regardless of whether it should queue to avoid potential
			-- lag if the server is slow to respond.
			dispatcher(table.unpack(action.arguments))
		end
	end

	function receiver.middleware(producer)
		rootProducer = producer

		if requestInterval > 0 then
			setInterval(requestMerge, requestInterval)
		end

		requestMerge()

		return function(dispatch)
			return dispatch
		end
	end

	return receiver
end

return createBroadcastReceiver
