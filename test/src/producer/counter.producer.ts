import { createProducer } from "@rbxts/reflex";

export interface CounterState {
	count: number;
}

const initialCounterState: CounterState = {
	count: 0,
};

export const counterProducer = createProducer(initialCounterState, {
	increment: (state) => ({
		...state,
		count: state.count + 1,
	}),

	decrement: (state) => ({
		...state,
		count: state.count - 1,
	}),

	reset: () => initialCounterState,
});

export const selectCount = (state: { counter: CounterState }) => state.counter.count;
