import { Middleware } from "../types";
import { entries } from "../utils/entries";

/**
 * A middleware that logs every action that is dispatched, and the new state
 * after the action has been dispatched.
 */
export const loggerMiddleware: Middleware = (producer) => (done) => (action) => {
	const params: string[] = [];

	for (const [, value] of entries(action.arguments)) {
		params.push(stringify(value));
	}

	print(`[loggerMiddleware]: Dispatching ${action.type}(${params.join(", ")})`);

	const newState = done(action);

	print("[loggerMiddleware]: New state:", producer.getState());

	return newState;
};

function stringify(value: unknown): string {
	if (typeIs(value, "string")) {
		return `"${value}"`;
	} else if (typeIs(value, "table")) {
		return `{ ${[...entries(value)].map(([key, value]) => `${key}: ${tostring(value)}`).join(", ")} }`;
	}

	return tostring(value);
}
