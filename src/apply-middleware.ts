import { Middleware, MiddlewareAction, Producer } from "./types";
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
		const chain = middlewares.map((middleware) => middleware(producer));

		for (const [name, dispatcher] of entries<string, Callback>(dispatchers)) {
			let dispatch = (action: MiddlewareAction<any>) => {
				return dispatcher(...action.arguments);
			};

			// Compose the middleware chain.
			dispatch = chain.reduce((a, b) => {
				return (done) => a(b(done));
			})(dispatch);

			dispatchers[name] = (...args: unknown[]) => {
				// Convert the arguments to an action type so middleware can narrow
				// the argument types and access the dispatcher name.
				return dispatch({ type: name, arguments: args } satisfies MiddlewareAction<any>);
			};

			producer[name] = dispatchers[name];
		}

		return producer;
	};
}
