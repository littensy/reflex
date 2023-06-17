import { createProducer } from "@rbxts/reflex";

export interface SharedCounterState {
	count: number;
}

const initialState: SharedCounterState = {
	count: 0,
};

export const sharedCounterProducer = createProducer(initialState, {
	incrementShared: (state) => ({
		...state,
		count: state.count + 1,
	}),

	decrementShared: (state) => ({
		...state,
		count: state.count - 1,
	}),

	multiplyShared: (state, multiplier: number) => ({
		...state,
		count: state.count * multiplier,
	}),

	resetShared: () => ({
		...initialState,
	}),
});
