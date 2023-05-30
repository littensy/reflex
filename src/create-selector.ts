import { InferSelectorArrayResults, MergeSelectors, SelectorArray } from "./types";
import { entries } from "./utils/object";

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
export function createSelector<Selectors extends SelectorArray, Result>(
	dependencies: Selectors,
	combiner: (...args: InferSelectorArrayResults<Selectors>) => Result,
): MergeSelectors<Selectors, Result>;

export function createSelector(dependencies: Callback[], combiner: (...args: unknown[]) => unknown) {
	const dependencyCount = dependencies.size();
	const dependencyCache: unknown[] = [];
	const argumentCache: unknown[] = [];

	let value: unknown;
	let firstCall = true;

	// When this memoized selector is called, call the dependencies first. If
	// their outputs are not shallowly equal to the last time the dependencies
	// were called, then call the selector function and return its output.
	return (...args: unknown[]) => {
		let argumentsChanged = firstCall;
		let recompute = firstCall;

		firstCall = false;

		// Iterate through arguments in any order. If any argument is not equal to
		// the cached argument, then the arguments have changed.
		for (const [index, argument] of entries<number, unknown>(args)) {
			if (argument !== argumentCache[index]) {
				argumentsChanged = true;
				argumentCache[index] = argument;
			}
		}

		// The above loop skips any argument that is 'nil'. This loop will double
		// check for any arguments that changed to 'nil'.
		if (!argumentsChanged) {
			for (const [index] of entries<number, unknown>(argumentCache)) {
				if (args[index] === undefined) {
					argumentsChanged = true;
					argumentCache[index] = undefined;
				}
			}
		}

		if (argumentsChanged) {
			// Iterate through dependencies in reverse order, so that if a dependency
			// returns 'nil', the results that follow do not get cut off when unpacking.
			for (const index of $range(dependencyCount - 1, 0, -1)) {
				const result: unknown = dependencies[index](...args);

				if (result !== dependencyCache[index]) {
					recompute = true;
				}

				dependencyCache[index] = result;
			}
		}

		if (recompute) {
			value = combiner(...dependencyCache);
		}

		return value;
	};
}
