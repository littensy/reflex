---
description: Learn how to use the useSelector and useSelectorCreator hook to subscribe to state.
---

# Selecting State

Similar to the [`subscribe`](../../reference/reflex/producer#subscribeselector-predicate-listener) method, the [`useSelector`](../../reference/roact-reflex/use-selector) hook lets you select a value from the producer's state.

:::note what you'll learn

-   🍰 How to select a value from the producer
-   ⚙️ How to select state with a selector factory
-   📦 How to write a pre-typed `useSelector` hook

:::

---

## Subscribing to state

Let's say we had the same `todos` slice from the [previous guide](using-the-producer) in our root producer:

```ts title="todos.ts"
interface TodosState {
	readonly list: readonly string[];
}

// ...

export const todosSlice = createProducer(initialState, {
	addTodo: (state, todo: string) => ({
		...state,
		list: [...state.list, todo],
	}),
});
```

If you want to select the todo list from the state in your component, you might try to subscribe to the producer and update the component's state whenever the todo list changes:

```tsx title="TodoList.tsx"
const selectTodos = (state: RootState) => state.todos.list;

function TodoList() {
    const producer = useRootProducer();
    const [todos, setTodos] = useState(producer.getState(selectTodos)));

    useEffect(() => {
        return producer.subscribe(selectTodos, setTodos);
    }, [])
    // ...
}
```

Now you have the todo list in your component's state, but you have to update it manually whenever the todo list changes. This is where the `useSelector` hook comes in:

```tsx title="TodoList.tsx"
const selectTodos = (state: RootState) => state.todos.list;

function TodoList() {
	// highlight-next-line
	const todos = useSelector(selectTodos);
	// ...
}
```

The [`useSelector`](../../reference/roact-reflex/use-selector) hook automatically subscribes to the producer you passed to the [`<ReflexProvider>`](../../reference/roact-reflex/reflex-provider) and updates the component whenever the selected value changes!

:::caution

**The same rules apply to the `useSelector` hook as the [`subscribe`](../../reference/reflex/producer#subscribeselector-predicate-listener) method.** If you pass a selector that creates a new object or array every time it's called, your component can re-render more often than you expect.

[Read more about writing good selectors →](../using-selectors)

:::

---

## Passing arguments to selectors

Often, you'll want to select a value from the producer that depends on props passed to your component. For example, if you have a `TodoList` component that takes a `sortDirection` prop, you might want to select the todos that match the filter.

### Sorting todos

First, let's write a selector factory that takes the `sortDirection` argument:

```ts
const selectTodos = (state: RootState) => state.todos.list;

const selectSortedTodos = (sortDirection: "asc" | "desc") => {
	return createSelector([selectTodos] as const, (todos) => {
		return [...todos].sort((a, b) => {
			return sortDirection === "asc" ? a < b : a > b;
		});
	});
};
```

:::tip

This selector factory creates a **memoized** selector, which will only recompute the value when the `todos` dependency changes. It's good practice to memoize selectors that return new objects or arrays.

[Read more about writing good selectors →](../using-selectors)

:::

### The wrong way to use a selector factory

To use this selector in your component, you might try to call the selector factory in your component on its own:

```tsx title="TodoList.tsx"
function TodoList({ sortDirection }: Props) {
	// error-next-line
	// 🔴 Avoid: creates a selector every render, re-runs too often
	// error-next-line
	const todos = useSelector(selectSortedTodos(sortDirection));
	// ...
}
```

**But calling selector factories like this is dangerous!** It's not safe to create a selector inside of a component without passing it to `useMemo`. This is because of [how selector factories work](../using-selectors#passing-arguments-to-selectors) when the selector is created with `createSelector`.

When you call a selector factory, it creates a _new_ memoized selector initialized with a new cache. This means that the selector will "forget" its previous values and recompute it from scratch. So, how do we use a selector factory in a component?

### Using a selector factory

To use a selector factory, you need to avoid creating the selector unless the arguments change. You can do this with `useMemo`:

```tsx title="TodoList.tsx"
function TodoList({ sortDirection }: Props) {
	// highlight-start
	// ✅ Good: create a selector when the sortDirection changes
	const selector = useMemo(() => {
		return selectSortedTodos(sortDirection);
	}, [sortDirection]);
	// highlight-end

	const todos = useSelector(selector);
	// ...
}
```

Now, the selector will only be created when the `sortDirection` prop changes, allowing the selector to properly memoize its value.

This is also exactly what the [`useSelectorCreator`](../../reference/roact-reflex/use-selector-creator) hook does!

```tsx title="TodoList.tsx"
function TodoList({ sortDirection }: Props) {
	// highlight-start
	// ✨ Best: use the useSelectorCreator hook
	const todos = useSelectorCreator(selectSortedTodos, sortDirection);
	// highlight-end
	// ...
}
```

:::caution

Because your factory is memoized by its arguments, you should avoid passing arguments that change every re-render. For example, if you pass a function as an argument, it could be re-created every render, causing extra re-renders:

```tsx title="TodoList.tsx"
function TodoList() {
	// error-next-line
	// 🔴 Avoid: selector re-created for a new function every render
	// error-next-line
	const todos = useSelectorCreator(selectSortedTodos, (a, b) => a < b);
	// ...
}
```

Remember to memoize any arguments that change every render, including arrays and objects!

```tsx title="TodoList.tsx"
function TodoList() {
	// highlight-start
	// ✅ Good: memoizes the argument
	const sorter = useMemo(() => (a, b) => a < b, []);
	const todos = useSelectorCreator(selectSortedTodos, sorter);
	// highlight-end
	// ...
}
```

:::

---

## Pre-typed `useSelector` hook

You might want to create a selector and pass it to `useSelector` manually:

```tsx title="Button.tsx"
function Button() {
	const todos = useSelector((state: RootState) => state.todos.list);
	// ...
}
```

But this can get repetitive if you have to write the same `state` type for every selector. You can create a pre-typed `useSelector` hook to avoid this:

```tsx
import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/roact-reflex";
import { RootProducer } from "./producer";

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
// highlight-next-line
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;
```

Now, you can use the pre-typed `useSelector` hook in your components:

```tsx title="Button.tsx"
function Button() {
	// highlight-next-line
	const todos = useRootSelector((state) => state.todos.list);
	// ...
}
```

:::caution

You shouldn't create a pre-typed `useSelectorCreator` hook because the `state` types should be manually defined by the selector factory _outside_ of the component.

:::

---

## Summary

-   You can call [`useSelector`](../../reference/roact-reflex/use-selector) to select a value from the producer.
-   Use the [`useSelectorCreator`](../../reference/roact-reflex/use-selector-creator) hook to create a memoized selector factory that takes arguments.
-   You can create a pre-typed `useSelector` hook to avoid writing the same `state` type if you create selectors manually.
