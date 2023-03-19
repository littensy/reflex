import { CombineStates, Middleware, ProducerMap } from "../types";
import { entries } from "../utils/object";

/**
 * A container for storing a dispatcher call's name and arguments.
 */
export interface BroadcastActionContainer {
	type: string;
	arguments: unknown[];
}

/**
 * Options for the broadcast middleware.
 */
export interface BroadcasterOptions<T extends ProducerMap> {
	/**
	 * The producers that will be tracked.
	 */
	producers: T;

	/**
	 * A function that will fire event that broadcasts the actions given.
	 * @param players The players to broadcast to.
	 * @param actions The actions to broadcast.
	 */
	broadcast: (players: Player[], actions: BroadcastActionContainer[]) => void;
}

/**
 * A broadcaster that can be used to share actions with the client.
 */
export interface Broadcaster<T extends ProducerMap> {
	/**
	 * The middleware that will track incoming dispatches.
	 */
	middleware: Middleware;

	/**
	 * Gets the combined states of the producers in the provided map. This should
	 * only be called once per player and initiated by the receiver.
	 * @param player The player requesting the state. If a player requested the
	 * state more than once, an error will be thrown.
	 * @returns The combined states of the shared producers.
	 */
	playerRequestedState: (player: Player) => CombineStates<T>;
}

/**
 * Creates a broadcaster that can be used to share actions with the client. It
 * will track all actions that are dispatched by the provided producers and
 * broadcast them to the client.
 * @param options The options for the broadcaster.
 * @returns The broadcaster.
 */
export function createBroadcaster<T extends ProducerMap>(options: BroadcasterOptions<T>): Broadcaster<T> {
	const { producers, broadcast } = options;

	const playerList: Player[] = [];
	const actionFilter = new Set<string>();

	for (const [, producer] of entries(producers)) {
		for (const [key] of entries<string, any>(producer.getDispatchers())) {
			actionFilter.add(key);
		}
	}

	const playerRequestedState = (player: Player) => {
		assert(!playerList.includes(player), `Player ${player} cannot get state more than once!`);

		playerList.push(player);

		Promise.fromEvent(game.GetService("Players").PlayerRemoving, (left) => left === player).then(() => {
			playerList.unorderedRemove(playerList.indexOf(player));
		});

		const state: Partial<CombineStates<T>> = {};

		for (const [key, producer] of entries(producers)) {
			state[key] = producer.getState();
		}

		return state as CombineStates<T>;
	};

	const middleware: Middleware = (dispatch, resolve, producer) => {
		const actionPool: BroadcastActionContainer[] = [];

		let nextBroadcast: thread | undefined;

		const scheduleBroadcast = () => {
			if (nextBroadcast) {
				return;
			}

			nextBroadcast = task.defer(() => {
				nextBroadcast = undefined;
				const currentActionPool = table.clone(actionPool);
				actionPool.clear();
				broadcast(playerList, currentActionPool);
			});
		};

		return (...args) => {
			const actionName = resolve();

			if (!actionFilter.has(actionName)) {
				return dispatch(...args);
			}

			const result = dispatch(...args);

			actionPool.push({
				type: actionName,
				arguments: args,
			});

			scheduleBroadcast();

			return result;
		};
	};

	return {
		middleware,
		playerRequestedState,
	};
}
