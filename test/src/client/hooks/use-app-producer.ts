import { UseProducerHook, useProducer } from "@rbxts/reflex";
import { RootProducer } from "client/producer";

export const useAppProducer: UseProducerHook<RootProducer> = useProducer;
