---
sidebar_position: 4
description: Memoize and subscribe to to a selector factory with useSelectorCreator.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# useSelectorCreator

`useSelectorCreator` is a Reflex Hook that lets you memoize and subscribe to a [selector factory](../reflex/create-selector#selector-factories)'s state from your component.

```ts
const state = useSelectorCreator(factory, ...args);
```

<TOCInline toc={toc} />

---

## Reference

### `useSelectorCreator(factory, ...args)`

`useSelectorCreator` creates a selector with the given [selector factory](../reflex/create-selector#selector-factories) and `args`, and uses the result to subscribe to the state. It returns the selected state.

```ts
import { useSelectorCreator } from "@rbxts/roact-reflex";
import { selectTodo } from "./selectors";

function Todo({ id }: Props) {
	const todo = useSelectorCreator(selectTodo, id);
	// ...
}
```

The selector returned by the factory will be memoized in `useMemo` with the given `args` to preserve the cache. If the `args` change, the selector will be re-created.

[See more examples below.](#usage)

#### Parameters

-   `factory` - A function that returns a selector for the given arguments.
-   `...args` - Arguments to pass to the selector factory and memoize with.

#### Returns

`useSelectorCreator` returns the selected value from the root producer's state. If the value changes, the component will re-render.

:::info caveats

-   Avoid creating new objects and passing them to `...args`, as this will cause `useSelectorCreator` to re-create the selector every re-render. If you need to pass an object, [memoize it with `useMemo`](https://react.dev/reference/react/useMemo).

:::

---

## Usage

### Subscribing to state with selector factories

[Selector factories](../reflex/create-selector#selector-factories) are useful for creating selectors that depend on external arguments. For example, a selector that selects a todo by its ID might look like this:

```ts
const selectTodo = (id: number) => {
	return createSelector([selectTodos], (todos) => {
		return todos.find((todo) => todo.id === id);
	});
};
```

Roact Reflex provides [`useSelector`](use-selector) to connect a function component to selectors, but it's not safe to create a selector inside of a component without memoizing it. This is because the selector will be re-created on every render, which will create a new cache, causing further re-renders.

To solve this, you might try to memoize the selector with the `useMemo` hook:

```ts
import { selectTodo } from "./selectors";

function Todo({ id }: Props) {
	// highlight-start
	const selector = useMemo(() => {
		return selectTodo(id);
	}, [id]);
	// highlight-end

	const todo = useSelector(selector);

	// ...
}
```

This works, and it's essentially what [`useSelectorCreator`](#useselectorcreatorfactory-args) does. It creates a selector with the given arguments, memoizes it with the arguments you passed, and subscribes to the selector's state.

```ts
import { useSelectorCreator } from "@rbxts/roact-reflex";
import { selectTodo } from "./selectors";

function Todo({ id }: Props) {
	const todo = useSelectorCreator(selectTodo, id);
	// ...
}
```

---

## Troubleshooting

### `useSelectorCreator` is creating a new selector every render

If your selector factory is being called on every render, make sure you're not creating new arrays or objects and passing them to `...args`. This will cause `useSelectorCreator` to re-create the selector every render.

Here's an example of what _not_ to do:

```ts
import { selectTodos } from "./selectors";

function Todo() {
	// highlight-start
	// 🔴 This array is not memoized
	const todos = useSelectorCreator(selectTodos, [1, 2, 3]);
	// highlight-end
	// ...
}
```

Instead, you should memoize the array with `useMemo`:

```ts
import { selectTodos } from "./selectors";

function Todo() {
	// highlight-start
	// ✅ This array is memoized
	const ids = useMemo(() => [1, 2, 3], []);
	const todos = useSelectorCreator(selectTodos, ids);
	// highlight-end
	// ...
}
```
