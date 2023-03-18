import { useMemo } from "@rbxts/roact-hooked";
import { InferState, Producer } from "../types";
import { useSelector } from "./use-selector";

/**
 * A hook that returns the result of a selector function that is called
 * with the current state of the producer.
 *
 * This type is typically not necessary if your selector function is created
 * with an explicitly typed `state` parameter.
 *
 * @example
 * // reflex-hooks.ts
 * export const useAppSelectorCreator: UseSelectorCreatorHook<RootProducer> = useSelectorCreator;
 *
 * // selectors.ts
 * export const selectUsers = (state: RootState) => state.users;
 * export const selectUsername = (id: number) => {
 * 	return createSelector([selectUsers], (users) => users[id].name);
 * };
 *
 * // MyComponent.tsx
 * const username = useAppSelectorCreator(selectUsername, 1);
 *
 * @param selectorCreator A function that takes the current state of the producer
 * and returns a value to be used in the component.
 * @param args Arguments to pass to the selector creator
 * @returns The result of the selector function.
 */
export type UseSelectorCreatorHook<T extends Producer<any, any>> = <Selection, Args extends unknown[]>(
	selectorCreator: (...args: Args) => (state: InferState<T>) => Selection,
	...args: Args
) => Selection;

/**
 * Similar to `useSelector`, but accepts a selector creator function that
 * returns a selector. The selector creator is only called when the arguments
 * change and the selector is memoized.
 *
 * @example
 * // selectors.ts
 * export const selectUsers = (state: RootState) => state.users;
 * export const selectUsername = (id: number) => {
 * 	return createSelector([selectUsers], (users) => users[id].name);
 * };
 *
 * // MyComponent.tsx
 * const username = useSelectorCreator(selectUsername, 1);
 *
 * @param selectorCreator A function that takes the current state of the producer
 * and returns a value to be used in the component.
 * @param args Arguments to pass to the selector creator function.
 * @returns The result of the selector function.
 */
export function useSelectorCreator<Selection, Args extends unknown[]>(
	selectorCreator: (...args: Args) => (state: any) => Selection,
	...args: Args
): Selection {
	const selector = useMemo(() => {
		return selectorCreator(...args);
	}, args);

	return useSelector(selector);
}
