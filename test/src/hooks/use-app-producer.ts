import { UseProducerHook, useProducer } from "@rbxts/reflex";
import { RootProducer } from "src/producer";

export const useAppProducer: UseProducerHook<RootProducer> = useProducer;
