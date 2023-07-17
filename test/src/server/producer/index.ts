import { InferDispatchers, InferState, combineProducers, loggerMiddleware } from "@rbxts/reflex";
import { slices } from "shared/slices";
import { serverCounterSlice } from "./server-counter";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;
export type RootDispatchers = InferDispatchers<RootProducer>;

export const producer = combineProducers({
	serverCounter: serverCounterSlice,
	...slices,
});

producer.applyMiddleware(loggerMiddleware);
