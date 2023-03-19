import { createProducer } from "@rbxts/reflex";

export interface ClientCounterProducer {
	count: number;
}

const initialState: ClientCounterProducer = {
	count: 0,
};

export const clientCounterProducer = createProducer(initialState, {
	incrementClient: (state) => ({ ...state, count: state.count + 1 }),
	decrementClient: (state) => ({ ...state, count: state.count - 1 }),
	resetClient: () => ({ ...initialState }),
});

export const selectClientCount = (state: { clientCounter: ClientCounterProducer }) => state.clientCounter.count;
