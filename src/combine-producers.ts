import { CombineProducer, CombineStates, Producer, ProducerMap } from "./types";
import { entries } from "./utils/entries";

/**
 * Combines multiple producers into a single producer.
 *
 * Any dispatcher called on the combined producer will call the dispatchers of
 * the same name on each producer. The combined state will be updated after all
 * dispatchers have been called.
 *
 * **⚠️ Warning:** Don't call dispatchers on the individual producers. This will
 * cause the combined state to be out of sync.
 *
 * @param producers A map of producers to combine.
 * @returns A producer that combines the state of all the given producers.
 */
export function combineProducers<Producers extends ProducerMap>(producers: Producers): CombineProducer<Producers> {
	let combinedState = combineState(producers);
	let combinedStateSinceFlush = combinedState;

	let nextFlush: thread | undefined;
	let nextSubscriptionId = 0;

	const subscribers = new Map<number, (state: any, prevState: any) => void>();
	const combinedDispatchers: Record<string, unknown> = {};

	// Calls the dispatcher of the same name on each producer.
	const dispatch = (key: string, ...args: unknown[]) => {
		let stateChanged = false;

		const newCombinedState: Record<string, unknown> = {};

		// Call every dispatcher of the same name on each producer
		for (const [producerName, producer] of entries<ProducerMap>(producers)) {
			const dispatchers = producer.getDispatchers();
			const dispatcher: unknown = dispatchers[key as never];

			if (!typeIs(dispatcher, "function")) {
				newCombinedState[producerName] = producer.getState();
				continue;
			}

			const currentState: unknown = producer.getState();
			const newState: unknown = dispatcher(...args);

			newCombinedState[producerName] = newState;

			if (currentState !== newState) {
				stateChanged = true;
			}
		}

		// If the state has changed, update the combined state and flush
		if (!stateChanged) {
			return;
		}

		combinedState = newCombinedState;

		if (!nextFlush) {
			nextFlush = task.defer(() => {
				nextFlush = undefined;
				combinedProducer.flush();
			});
		}
	};

	// Add each producer's dispatchers to the combined dispatchers, where calling
	// one dispatcher will call the dispatcher on each producer.
	for (const [, producer] of entries<ProducerMap>(producers)) {
		for (const [dispatcherName] of entries<string, unknown>(producer.getDispatchers())) {
			combinedDispatchers[dispatcherName] = (...args: unknown[]) => {
				dispatch(dispatcherName, ...args);
				return combinedState;
			};
		}
	}

	const combinedProducer: Producer<typeof combinedState, {}> = {
		getState() {
			return combinedState;
		},

		select(selector) {
			return selector(combinedState);
		},

		setState(newState) {
			combinedState = table.clone(newState);

			if (!nextFlush) {
				nextFlush = task.defer(() => {
					nextFlush = undefined;
					this.flush();
				});
			}

			return combinedState;
		},

		getDispatchers() {
			return combinedDispatchers;
		},

		flush() {
			if (nextFlush) {
				task.cancel(nextFlush);
				nextFlush = undefined;
			}

			if (combinedStateSinceFlush !== combinedState) {
				const prevState = combinedStateSinceFlush;
				combinedStateSinceFlush = combinedState;

				for (const [, subscriber] of subscribers) {
					subscriber(combinedState, prevState);
				}
			}
		},

		subscribe(
			selectorOrCallback: (state: any, prevState?: any) => void,
			callbackOrUndefined?: (state: any, prevState: any) => void,
		) {
			const id = nextSubscriptionId++;

			if (callbackOrUndefined) {
				let selection = selectorOrCallback(combinedState);

				subscribers.set(id, () => {
					const newSelection = selectorOrCallback(combinedState);

					if (selection !== newSelection) {
						const prevSelection = selection;
						selection = newSelection;
						callbackOrUndefined(newSelection, prevSelection);
					}
				});
			} else {
				subscribers.set(id, selectorOrCallback);
			}

			return () => {
				subscribers.delete(id);
			};
		},

		once(selector, callback) {
			const unsubscribe = this.subscribe(selector, (state, prevState) => {
				unsubscribe();
				callback(state, prevState);
			});

			return unsubscribe;
		},

		wait(selector) {
			return new Promise((resolve, _, onCancel) => {
				const unsubscribe = this.once(selector, resolve);
				onCancel(unsubscribe);
			});
		},

		destroy() {
			if (nextFlush) {
				task.cancel(nextFlush);
				nextFlush = undefined;
			}

			subscribers.clear();
		},

		enhance(enhancer) {
			return enhancer(this);
		},

		Connect(callback) {
			const unsubscribe = this.subscribe(callback);
			return {
				Connected: true,
				Disconnect() {
					this.Connected = false;
					unsubscribe();
				},
			};
		},

		Once(callback) {
			const unsubscribe = this.once((state) => state, callback);
			return {
				Connected: true,
				Disconnect() {
					this.Connected = false;
					unsubscribe();
				},
			};
		},

		Wait() {
			return $tuple(this.wait((state) => state).expect());
		},

		...combinedDispatchers,
	};

	return combinedProducer as CombineProducer<Producers>;
}

/**
 * Combines the state of multiple producers into a single object.
 * @param producers A map of producers to combine.
 * @returns An object containing the state of each producer.
 */
function combineState(producers: ProducerMap) {
	const combinedState = {} as CombineStates<ProducerMap>;

	for (const [key, producer] of pairs(producers)) {
		combinedState[key] = producer.getState();
	}

	return combinedState;
}
