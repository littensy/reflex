local createProducer = require(script.Parent.Parent.createProducer)
local applyMiddleware = require(script.Parent.Parent.applyMiddleware)
local broadcaster = require(script.Parent.broadcaster)

--- A receiver that can be used to dispatch actions broadcasted by the server.
export type BroadcastReceiver = {
	--- A middleware that should be applied to the root producer. This will
	--- merge the producer's state with the server's state on join.
	middleware: applyMiddleware.Middleware,

	--- Dispatches actions broadcasted by the server.
	--- @param actions A list of action containers to dispatch.
	dispatch: (actions: { broadcaster.BroadcastAction }) -> (),
}

--- Options for the broadcast receiver.
export type BroadcastReceiverOptions = {
	--- A function that should request the server's state through its broadcaster.
	--- This will be called when the middleware is applied to access the server's
	--- state.
	--- @returns A Promise that resolves with the server's state.
	requestState: () -> any,
}

--- Creates a broadcast receiver object that can be used to dispatch actions
--- broadcasted by the server.
--- @param options The options for the broadcast receiver.
--- @return The broadcast receiver.
local function createBroadcastReceiver(options: BroadcastReceiverOptions): BroadcastReceiver
	local requestState = options.requestState

	local rootProducer: createProducer.Producer<any>?

	local middleware: applyMiddleware.Middleware = function(dispatch, _, producer)
		rootProducer = producer

		requestState():andThen(function(serverState)
			local nextState = table.clone(producer:getState())

			for key, value in serverState do
				nextState[key] = value
			end

			producer:setState(nextState)
		end)

		return dispatch
	end

	local function dispatch(actions: { broadcaster.BroadcastAction })
		assert(rootProducer, "Cannot dispatch actions before the middleware is applied")

		local dispatchers = rootProducer:getDispatchers()

		for _, action in actions do
			if dispatchers[action.name] then
				dispatchers[action.name](table.unpack(action.arguments))
			end
		end
	end

	return {
		middleware = middleware,
		dispatch = dispatch,
	}
end

return createBroadcastReceiver
