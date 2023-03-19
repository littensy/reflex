/**
 * Casts an object to a Map type. This is a workaround for challenges with
 * iterating over an object or array.
 * @param object The object to cast.
 * @returns The object as a Map.
 */
export function entries<T>(object: T): Map<keyof T, T[keyof T]>;
export function entries<K extends string | number | symbol, V>(object: Record<K, V>): Map<K, V>;
export function entries<K, V>(object: any): Map<K, V>;
export function entries<K, V>(object: any): Map<K, V> {
	return object as never;
}

/**
 * Returns the keys of an object as an array.s
 * @param object The object to get the keys of.
 * @returns The keys of the object.
 */
export function keys<K extends string | number | symbol>(object: Record<K, any>): K[];
export function keys<T>(object: T): (keyof T)[];
export function keys<K>(object: any): K[];
export function keys<T>(object: T): (keyof T)[] {
	const keys: (keyof T)[] = [];

	for (const [key] of entries(object)) {
		keys.push(key);
	}

	return keys;
}
