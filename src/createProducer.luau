export type Producer<State, ActionName, ActionArgs...> = {
	[ActionName]: (ActionArgs...) -> State,
}

--- Creates a producer that can be used to manage state.
---
--- A producer is a state container that exposes a set of dispatchers that can
--- be used to modify the state. The state is immutable, so the dispatchers
--- return a new state object.
---
--- The dispatchers are also exposed as callbacks in the producer, and are based
--- on the actions parameter, but with the first argument omitted.
---
--- @param initialState The initial state of the producer.
--- @param actions A set of actions that can be used to modify the state.
--- @return A producer that can be used to manage state.
local function createProducer<State, ActionName, ActionArgs...>(
	initialState: State,
	actions: {
		[ActionName]: (state: any, ActionArgs...) -> any,
	}
): Producer<State, ActionName, ActionArgs...>
	return nil :: any
end
