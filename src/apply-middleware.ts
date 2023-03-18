import { InferActions, Producer } from "./types";
import { entries } from "./utils/entries";

export type Middleware<T extends Producer<any, any> = Producer<unknown, Record<string, Callback>>> = (
	producer: T,
) => (done: NextMiddleware<InferActions<T>>) => NextMiddleware<InferActions<T>>;

export type NextMiddleware<A> = (action: MiddlewareAction<A>) => unknown;

export type MiddlewareAction<A = Record<string, unknown>> = {
	[K in keyof A]: {
		type: K;
		arguments: Parameters<A[K]> extends [any, ...infer Rest] ? Rest : unknown[];
	};
}[keyof A];

/**
 * Creates a producer enhancer that applies middleware to every dispatcher
 * function in the producer.
 * @param middlewares The middleware to apply.
 * @returns The producer enhancer.
 */
export function applyMiddleware<T extends Producer<any, any>>(...middlewares: Middleware<any>[]): (producer: T) => T;
export function applyMiddleware(...middlewares: Middleware<any>[]) {
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
