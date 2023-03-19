import { createProducer } from "@rbxts/reflex";

export interface SharedCounterProducer {
	count: number;
}

const initialState: SharedCounterProducer = {
	count: 0,
};

export const sharedCounterProducer = createProducer(initialState, {
	incrementShared: (state) => ({ ...state, count: state.count + 1 }),
	decrementShared: (state) => ({ ...state, count: state.count - 1 }),
	multiplyShared: (state, multiplier: number) => ({ ...state, count: state.count * multiplier }),
	resetShared: () => ({ ...initialState }),
});

export const selectSharedCount = (state: { sharedCounter: SharedCounterProducer }) => state.sharedCounter.count;
