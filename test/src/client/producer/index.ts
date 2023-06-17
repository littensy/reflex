import { InferDispatchers, InferState, combineProducers } from "@rbxts/reflex";
import { sharedProducers } from "shared/producer";
import { clientCounterProducer } from "./client-counter";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
export type RootDispatchers = InferDispatchers<RootProducer>;

export const producer = combineProducers({
	clientCounter: clientCounterProducer,
	...sharedProducers,
});
