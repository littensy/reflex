local types = require(script.Parent.types)
local createProducer = require(script.Parent.createProducer)

local function combineInitialState(producers: types.ProducerMap)
	local initialState = {}

	for name, producer in producers do
		initialState[name] = producer:getState()
	end

	return initialState
end

local function combineActions(producers: types.ProducerMap)
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

--[=[
	Combines multiple producers into a single producer. Any dispatchers called
	on the combined producer will call the dispatchers of the same name on each
	of the producers passed in.

	**Don't use the individual producers.** The combined producer is the only
	one that should be used to prevent unexpected behavior.

	@param producers A map of producers to combine.
	@return A combined producer.
]=]
local function combineProducers(producers: types.ProducerMap)
	return createProducer(combineInitialState(producers), combineActions(producers))
end

return combineProducers
