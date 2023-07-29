local types = require(script.Parent.Parent.types)

local HYDRATE = "__hydrate__"

local function createHydrateAction(state: any): types.BroadcastAction
	return {
		name = HYDRATE,
		arguments = { state },
	}
end

local function isHydrate(action: types.BroadcastAction): boolean
	return action.name == HYDRATE
end

return {
	createHydrateAction = createHydrateAction,
	isHydrate = isHydrate,
}
