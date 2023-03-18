import { AnySelectors, InferSelectorArguments, InferSelectorResults } from "./types";
import { entries } from "./utils/entries";

/**
 * Creates a memoized selector function. The selector function is only called
 * if the outputs of the dependencies have changed.
 *
 * This function is only necessary if your selector is expensive to compute, or
 * derives some state (i.e. mapping an array). This is because selectors are
 * called on every state change, and if the selector is expensive, it might
 * need to be memoized.
 *
 * When using more than one dependency, make sure to mark them `as const`!
 *
 * @param dependencies The selectors that the selector function depends on.
 * @param selector The selector function.
 * @returns The memoized selector function.
 */
export function createSelector<Selectors extends AnySelectors, Result>(
	dependencies: Selectors,
	selector: (...args: InferSelectorResults<Selectors>) => Result,
): (...args: InferSelectorArguments<Selectors>) => Result {
	const dependencyCache: Record<number, unknown> = {};
	const argumentCache: Record<number, unknown> = {};

	let value: Result;
	let firstCall = true;

	// When this memoized selector is called, call the dependencies first. If
	// their outputs are not shallowly equal to the last time the dependencies
	// were called, then call the selector function and return its output.
	return (...args: InferSelectorArguments<Selectors>): Result => {
		let argumentsChanged = firstCall;
		let recompute = firstCall;

		for (const [index, argument] of entries<number, unknown>(args)) {
			if (argument !== argumentCache[index]) {
				argumentsChanged = true;
				argumentCache[index] = argument;
			}
		}

		if (argumentsChanged) {
			for (const [index, dependency] of entries<number, Callback>(dependencies)) {
				const result: unknown = dependency(...args);

				if (result !== dependencyCache[index]) {
					recompute = true;
					dependencyCache[index] = result;
				}
			}
		}

		if (recompute) {
			firstCall = false;
			value = selector(...(dependencyCache as InferSelectorResults<Selectors>));
		}

		return value;
	};
}
