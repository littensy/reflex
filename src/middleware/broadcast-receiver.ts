import { CombineStates, Producer, ProducerMap } from "../types";
import { BroadcastActionContainer } from "./broadcaster";

/**
 * A receiver that can be used to dispatch actions broadcasted by the server.
 */
interface BroadcastReceiver {
	/**
	 * An enhancer that will be applied to the producer. This will hydrate the
	 * producer's state with the server's state.
	 * @param producer The producer to enhance.
	 * @returns The enhanced producer.
	 */
	enhancer: <T extends Producer<any, any>>(producer: T) => T;

	/**
	 * Dispatches actions broadcasted by the server.
	 * @param actions The actions to dispatch.
	 */
	dispatch: (actions: BroadcastActionContainer[]) => void;
}

/**
 * Options for the broadcast receiver.
 */
interface BroadcastReceiverOptions<T extends ProducerMap> {
	/**
	 * A function that invokes an event on the server to get the state of the
	 * producers being broadcasted.
	 * @returns A Promise that resolves with the state of the producers.
	 */
	getServerState: () => Promise<CombineStates<T>>;
}

/**
 * Creates a receiver that can be used to dispatch actions broadcasted by the
 * server.
 * @param options The options for the receiver.
 * @returns The receiver.
 */
export function createBroadcastReceiver<T extends ProducerMap>(
	options: BroadcastReceiverOptions<T>,
): BroadcastReceiver {
	const { getServerState } = options;

	let currentProducer: Producer<any, any> | undefined;

	const enhancer = <T extends Producer<any, any>>(producer: T): T => {
		currentProducer = producer;

		getServerState().then((state) => {
			producer.setState({
				...producer.getState(),
				...state,
			});
		});

		return producer;
	};

	const dispatch = (actions: BroadcastActionContainer[]) => {
		assert(currentProducer, "Cannot dispatch actions before enhancer is applied");

		const dispatchers = currentProducer.getDispatchers();

		for (const action of actions) {
			dispatchers[action.type](...action.arguments);
		}
	};

	return {
		enhancer,
		dispatch,
	};
}
