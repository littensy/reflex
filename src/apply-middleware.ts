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
			const dispatcherWithMiddleware: Callback = compose(chain)((action: MiddlewareAction<any>) => {
				return dispatcher(...action.arguments);
			});

			// Make sure that the first parameter is the dispatcher name
			dispatchers[name] = (...args: unknown[]) => {
				return dispatcherWithMiddleware({ type: name, arguments: args } satisfies MiddlewareAction<any>);
			};

			producer[name] = dispatchers[name];
		}

		return producer;
	};
}

function compose(callbacks: ((...args: any[]) => any)[]) {
	return callbacks.reduce((a, b) => {
		return (...args: unknown[]) => a(b(...args));
	});
}
