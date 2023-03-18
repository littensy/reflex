import { Middleware } from "../types";
import { entries } from "../utils/entries";

/**
 * A middleware that logs every action that is dispatched, and the new state
 * after the action has been dispatched.
 */
export const loggerMiddleware: Middleware = (producer) => (done) => (action) => {
	const params: string[] = [];

	for (const [, value] of entries(action.arguments)) {
		params.push(tostring(value));
	}

	print(`[loggerMiddleware]: Dispatching ${action.type}(${params.join(", ")})`);

	const newState = done(action);

	print("[loggerMiddleware]: New state:", producer.getState());

	return newState;
};
