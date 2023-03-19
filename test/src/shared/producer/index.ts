import { CombineStates } from "../../types";
import { sharedCounterProducer } from "./shared-counter.producer";

export type SharedState = CombineStates<typeof sharedProducers>;

// Don't combine state yet! This gets merged with the client and server state.
export const sharedProducers = {
	sharedCounter: sharedCounterProducer,
};
