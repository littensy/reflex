import { CombineStates } from "@rbxts/reflex";
import { sharedCounterProducer } from "./shared-counter";

export type SharedState = CombineStates<typeof sharedProducers>;

// This gets spread into the client and server state, and is used to create the
// broadcaster and receiver.
export const sharedProducers = {
	sharedCounter: sharedCounterProducer,
};
