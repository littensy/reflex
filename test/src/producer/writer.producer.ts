import { createProducer } from "@rbxts/reflex";

export interface WriterState {
	text: string;
}

const initialWriterState: WriterState = {
	text: "",
};

export const writerProducer = createProducer(initialWriterState, {
	write: (state, text: string) => ({
		...state,
		text: state.text + text,
	}),

	clear: () => initialWriterState,
});

export const selectText = (state: { writer: WriterState }) => state.writer.text;
