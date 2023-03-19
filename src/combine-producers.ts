import { createProducer } from "./create-producer";
import { Actions, CombineActions, CombineProducer, CombineStates, ProducerMap } from "./types";
import { entries } from "./utils/object";

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
export function combineProducers<T extends ProducerMap>(producers: T): CombineProducer<T> {
	const initialState = combineState(producers);
	const actions = combineActions(producers);

	return createProducer(initialState, actions) as unknown as CombineProducer<T>;
}

function combineState<T extends ProducerMap>(producers: T) {
	const combinedState = {} as CombineStates<T>;

	for (const [key, producer] of entries(producers)) {
		combinedState[key] = producer.getState() as never;
	}

	return combinedState;
}

function combineActions<T extends ProducerMap>(producers: T) {
	const combinedActions = {} as CombineActions<ProducerMap>;

	const actionsByName = new Map<string, Callback[]>();
	const producerKeysByAction = new Map<Callback, keyof T>();

	for (const [producerKey, producer] of entries(producers)) {
		for (const [actionKey, action] of pairs(producer.getActions())) {
			if (actionsByName.has(actionKey)) {
				actionsByName.get(actionKey)!.push(action);
			} else {
				actionsByName.set(actionKey, [action]);
			}

			producerKeysByAction.set(action, producerKey);
		}
	}

	for (const [actionKey, actions] of actionsByName) {
		combinedActions[actionKey] = (combinedState: CombineStates<T>, ...args: unknown[]) => {
			const newState = table.clone(combinedState);

			for (const action of actions) {
				const producerKey = producerKeysByAction.get(action)!;
				const producerState = combinedState[producerKey];

				newState[producerKey] = action(producerState, ...args);
			}

			return newState;
		};
	}

	return combinedActions as Actions<CombineStates<T>>;
}
