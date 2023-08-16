local types = require(script.Parent.types)
local createProducer = require(script.Parent.createProducer)

local function combineStates(producers: types.ProducerSlices)
	local state = {}

	for name, slice in producers do
		state[name] = slice:getState()
	end

	return state
end

local function combineActions(producers: types.ProducerSlices)
	local combinedActions = {}
	local actionsByName = {}
	local producerNamesByAction = {}

	for producerName, producer in producers do
		for actionName, action in producer:getActions() do
			if actionsByName[actionName] then
				table.insert(actionsByName[actionName], action)
			else
				actionsByName[actionName] = { action }
			end

			producerNamesByAction[action] = producerName
		end
	end

	for actionName, actions in actionsByName do
		combinedActions[actionName] = function(combinedState, ...)
			local nextState = table.clone(combinedState)

			for _, action in actions do
				local producerName = producerNamesByAction[action]
				local producerState = nextState[producerName]
				nextState[producerName] = action(producerState, ...)
			end

			return nextState
		end
	end

	return combinedActions
end

local function combineProducers(producers: types.ProducerSlices)
	return createProducer(combineStates(producers), combineActions(producers))
end

return combineProducers
