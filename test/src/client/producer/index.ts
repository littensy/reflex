import { InferDispatchers, InferState, applyMiddleware, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { sharedProducers } from "shared/producer";
import { clientCounterProducer } from "./client-counter.producer";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
export type RootDispatchers = InferDispatchers<RootProducer>;

export const producer = combineProducers({
	clientCounter: clientCounterProducer,
	...sharedProducers,
}).enhance(applyMiddleware(loggerMiddleware));
