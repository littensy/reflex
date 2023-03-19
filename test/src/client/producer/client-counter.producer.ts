import { createProducer } from "@rbxts/reflex";

export interface ClientCounterState {
	count: number;
}

const initialState: ClientCounterState = {
	count: 0,
};

export const clientCounterProducer = createProducer(initialState, {
	incrementClient: (state) => ({ ...state, count: state.count + 1 }),
	decrementClient: (state) => ({ ...state, count: state.count - 1 }),
	resetClient: () => ({ ...initialState }),
});

export const selectClientCount = (state: { clientCounter: ClientCounterState }) => state.clientCounter.count;
