local types = require(script.Parent.Parent.types)

local HYDRATE = "__hydrate__"

local function createHydrateAction(state: any): types.BroadcastAction
	return {
		name = HYDRATE,
		arguments = { state },
	}
end

local function consumeHydrateAction(actions: { types.BroadcastAction }): types.BroadcastAction?
	local action = actions[1]

	if action and action.name == HYDRATE then
		return action.arguments[1]
	end

	return nil
end

return {
	createHydrateAction = createHydrateAction,
	consumeHydrateAction = consumeHydrateAction,
}
