import { useContext } from "@rbxts/roact-hooked";
import ReflexContext from "../components/ReflexContext";
import { Producer } from "../types";

/**
 * A hook that returns the producer from the ReflexProvider.
 *
 * @example
 * // reflex-hooks.ts
 * export const useAppProducer: UseProducerHook<RootProducer> = useProducer;
 *
 * // MyComponent.tsx
 * const producer = useAppProducer();
 * producer.incrementCounter();
 *
 * @returns The producer from the ReflexProvider.
 */
export type UseProducerHook<T extends Producer<any, any>> = () => T;

/**
 * Returns the producer from the ReflexProvider. Accepts a generic type
 * parameter that can be used to narrow the type of the producer.
 *
 * @example
 * const producer = useProducer<MyProducer>();
 * producer.incrementCounter();
 *
 * @returns The producer from the ReflexProvider.
 */
export function useProducer<T extends Producer<any, any>>(): T {
	const context = useContext(ReflexContext);
	assert(context, "useProducer must be called from within a ReflexProvider");
	return context.producer as T;
}
