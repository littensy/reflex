import { CombineStates } from "@rbxts/reflex";
import { sharedCounterSlice } from "./shared-counter";

export type SharedState = CombineStates<typeof slices>;

// This gets spread into the client and server state, and is used to create the
// broadcaster and receiver.
export const slices = {
	sharedCounter: sharedCounterSlice,
};
