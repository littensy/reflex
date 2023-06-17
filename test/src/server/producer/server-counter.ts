import { createProducer } from "@rbxts/reflex";

export interface ServerCounterState {
	count: number;
}

const initialState: ServerCounterState = {
	count: 0,
};

export const serverCounterProducer = createProducer(initialState, {
	incrementServer: (state) => ({ ...state, count: state.count + 1 }),
	decrementServer: (state) => ({ ...state, count: state.count - 1 }),
	resetServer: () => ({ ...initialState }),
});

export const selectServerCount = (state: { serverCounter: ServerCounterState }) => state.serverCounter.count;
