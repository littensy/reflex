local types = require(script.Parent.Parent.types)

local HYDRATE = "__hydrate__"

local function createHydratePayload(state: unknown): types.BroadcastAction
	return {
		name = HYDRATE,
		arguments = { state },
	}
end

local function isHydratePayload(action: types.BroadcastAction): boolean
	return action.name == HYDRATE
end

return {
	createHydratePayload = createHydratePayload,
	isHydratePayload = isHydratePayload,
}
