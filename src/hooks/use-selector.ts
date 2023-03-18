import { useEffect, useState } from "@rbxts/roact-hooked";
import { InferState, Producer } from "../types";
import { useProducer } from "./use-producer";

/**
 * A hook that returns the result of a selector function that is called
 * with the current state of the producer.
 *
 * This type is typically not necessary if your selector function is created
 * with an explicitly typed `state` parameter.
 *
 * @example
 * // reflex-hooks.ts
 * export const useAppSelector: UseSelectorHook<RootProducer> = useSelector;
 *
 * // MyComponent.tsx
 * const counter = useAppSelector((state) => state.counter);
 *
 * @param selector A function that takes the current state of the producer
 * and returns a value to be used in the component.
 * @param equalityFn An optional function that takes the previous and new
 * values returned by the selector and returns true if the new value should
 * be used in the component.
 * @returns The result of the selector function.
 */
export type UseSelectorHook<T extends Producer<any, any>> = <Selection>(
	selector: (state: InferState<T>) => Selection,
	equalityFn?: (a: Selection, b: Selection) => boolean,
) => Selection;

/**
 * Returns the result of a selector function that is called with the current
 * state of the producer.
 *
 * Accepts a generic type parameter to narrow the type of the producer, but it
 * is typically not necessary if your selector function is created with an
 * explicitly typed `state` parameter.
 *
 * @example
 * const selectCounter = (state: RootState) => state.counter;
 * const counter = useSelector(selectCounter);
 *
 * @param selector A function that takes the current state of the producer
 * and returns a value to be used in the component.
 * @param equalityFn An optional function that takes the previous and new
 * values returned by the selector and returns true if the new value should
 * be used in the component.
 * @returns The result of the selector function.
 */
export function useSelector<T>(selector: (state: any) => T, equalityFn?: (a: T, b: T) => boolean): T {
	const producer = useProducer();

	const [selection, setSelection] = useState(() => {
		return selector(producer.getState());
	});

	useEffect(() => {
		let prevSelection = selection;

		return producer.subscribe((newState) => {
			const newSelection = selector(newState);

			if (equalityFn ? equalityFn(newSelection, prevSelection) : newSelection !== prevSelection) {
				prevSelection = newSelection;
				setSelection(newSelection);
			}
		});
	}, [producer, selector]);

	return selection;
}
