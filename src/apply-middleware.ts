import { Middleware, Producer } from "./types";
import { entries } from "./utils/entries";

/**
 * Creates a producer enhancer that applies middleware to every dispatcher
 * function in the producer.
 * @param middlewares The middleware to apply.
 * @returns The producer enhancer.
 */
export function applyMiddleware<T extends Producer<any, any>>(...middlewares: Middleware[]): (producer: T) => T;
export function applyMiddleware(...middlewares: Middleware[]) {
	return (producer: Producer<any, any>) => {
		const dispatchers = producer.getDispatchers();

		let currentDispatcher: string | undefined;

		const resolveDispatcher = () => {
			assert(currentDispatcher, "Cannot resolve dispatcher outside of middleware");
			return currentDispatcher;
		};

		for (const [name, dispatcher] of entries<string, Callback>(dispatchers)) {
			let dispatch = dispatcher;

			for (const i of $range(middlewares.size() - 1, 0, -1)) {
				const middleware = middlewares[i];
				dispatch = middleware(dispatch, resolveDispatcher, producer);
			}

			const startDispatch = dispatch;

			dispatch = (...args: unknown[]) => {
				currentDispatcher = name;
				return startDispatch(...args);
			};

			dispatchers[name] = dispatch;
			producer[name] = dispatch;
		}

		return producer;
	};
}
