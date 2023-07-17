import { InferDispatchers, InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { slices } from "shared/slices";
import { clientCounterProducer } from "./client-counter";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
export type RootDispatchers = InferDispatchers<RootProducer>;

export const producer = combineProducers({
	clientCounter: clientCounterProducer,
	...slices,
});

producer.applyMiddleware(loggerMiddleware);
