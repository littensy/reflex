import { InferDispatchers, InferState, combineProducers } from "@rbxts/reflex";
import { sharedProducers } from "shared/producer";
import { serverCounterProducer } from "./server-counter.producer";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
export type RootDispatchers = InferDispatchers<RootProducer>;

export const producer = combineProducers({
	serverCounter: serverCounterProducer,
	...sharedProducers,
});
