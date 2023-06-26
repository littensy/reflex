---
sidebar_position: 3
description: Subscribe to a selector's state with useSelector.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TOCInline from "@theme/TOCInline";

# useSelector

`useSelector` is a Reflex Hook that lets you read and subscribe to a [producer](../reflex/producer)'s state from your component.

```ts
const state = useSelector((state) => state.value);
```

<TOCInline toc={toc} />

---

## Reference

### `useSelector(selector, isEqual?)`

`useSelector` subscribes to the root producer with the given `selector`, and returns the selected state.

```ts
import { useSelector } from "@rbxts/roact-reflex";
import { selectTodos } from "./selectors";

function Todos() {
	const todos = useSelector(selectTodos);
	// ...
}
```

[See more examples below.](#usage)

#### Parameters

-   `selector` - A function that, given the root producer's state, returns a new value.
-   `isEqual` - An optional function that compares the previous and next values. If the function returns `true`, the component will not re-render. By default, `===` is used.

#### Returns

`useSelector` returns the selected value from the root producer's state. If the value changes, the component will re-render.

:::info caveat

**Selectors that return _new_ objects can cause excessive re-renders.** If your selector performs array transformations or returns new objects, [it should be memoized with `createSelector`](../reflex/create-selector).

:::

---

### `isEqual` function

`isEqual` is a function that compares the current and previous values. If the function returns `true`, the component will not re-render. By default, `===` is used.

```ts
import { useSelector } from "@rbxts/roact-reflex";
import { selectTodos } from "./selectors";

function Todos() {
	const todos = useSelector(selectTodos, shallowEqual);
	// ...
}
```

#### Parameters

-   `current` - The current value of the selector.
-   `previous` - The previous value of the selector.

#### Returns

`isEqual` returns `true` if the current and previous values are equal.

---

## Usage

### Subscribing to a producer's state

Sometimes, components may want to access values from the producer's state. We'll go over how to create a basic todo list component that reads the producer's state. [Don't forget to include `<ReflexProvider>` in your app!](reflex-provider)

Call [`useSelector`](#useselectorselector-isequal) from a function component to read a value from the producer's state:

```ts
import { useSelector } from "@rbxts/roact-reflex";
import { selectTodos } from "./selectors";

function Todos() {
	// highlight-next-line
	const todos = useSelector(selectTodos);
	// ...
}
```

`Todos` will re-render whenever `selectTodos` returns a new value. Functionally, `useSelector` [subscribes](../reflex/producer#subscribeselector-predicate-listener) to the producer's state, and re-renders when the selected value changes.

You can then render a list of todos from the selected value:

```tsx
function Todos() {
	const todos = useSelector(selectTodos);

	return (
		<scrollingframe>
			// highlight-start
			{todos.map((todo) => (
				<Todo id={todo.id} />
			))}
			// highlight-end
		</scrollingframe>
	);
}
```

:::caution pitfall

**Selectors that return _new_ objects can cause excessive re-renders.** State updates are compared **by reference (`===`)**, so if your selector creates a new object, Reflex will assume an update happened and re-render. Remember to [memoize these selectors with `createSelector`](../reflex/create-selector).

:::

---

### Custom equality comparison

By default, [`useSelector`](#useselectorselector-isequal) uses `===` to compare the previous and next values. You can customize this behavior with the [`isEqual`](#isequal-function) parameter.

For example, some components might want to receive the latest state **only if it's defined** and exclude `undefined` values. You can write an equality function that compares the current and previous values, and returns `true` if the new value is `undefined`:

```ts
import { useSelector } from "@rbxts/roact-reflex";
import { selectValue } from "./selectors";

function isEqualOrUndefined(current: unknown, previous: unknown) {
	return current === previous || current === undefined;
}

function Button() {
	const value = useSelector(selectValue, isEqualOrUndefined);
	// ...
}
```

Remember that if the equality function returns `true`, the component **will not** re-render for that state update.

The logic can be a bit difficult to follow, so let's break down the two cases:

-   `current === previous` - If the current and previous values are equal, return `true`. This is the default behavior.
-   `current === undefined` - If the current value is `undefined`, return `true`. This tells Reflex that the values are "equal," and thus the component will not re-render for `undefined` values.

---

### Using selector factories

Selectors can receive parameters other than state using [selector factories](../reflex/create-selector#selector-factories), but using them with [`useSelector`](#useselectorselector-isequal) can be unsafe.

[Use factories with the `useSelectorCreator` hook.](use-selector-creator)

---

### Using selectors with curried arguments

Selectors can receive parameters other than state using [curried arguments](../reflex/create-selector#dependency-currying). You can use these selectors with [`useSelector`](#useselectorselector-isequal) by wrapping them in a function:

```ts
import { useSelector } from "@rbxts/roact-reflex";
import { selectTodo } from "./selectors";

function Todo({ id }: Props) {
	const todo = useSelector((state) => selectTodo(state, id));
	// ...
}
```

But you might wonder: _why isn't this selector memoized?_ This is safe because [`useSelector`](#useselectorselector-isequal) will only re-render when the selected value changes, and not necessarily when the selector function changes. It's safe to leave the selector function like this.

On the other hand, [selector factories](../reflex/create-selector#selector-factories) _should_ be memoized, because creating a new selector with [`createSelector`](../reflex/create-selector) on render also creates a new, empty argument cache, causing the selector to re-run when it shouldn't.

---

## Troubleshooting

### I'm getting an error: "`useSelector` must be called from within a `ReflexProvider`"

This error means that you're trying to use [`useSelector`](#useselectorselector-isequal) in a function component that isn't wrapped in a [`<ReflexProvider>`](reflex-provider), which throws this error because it uses [`useProducer`](use-producer) internally.

```tsx
function TodosApp() {
	const todos = useSelector(selectTodos);
	// ...
}

// error-next-line
// 🔴 Don't forget to wrap your root elements in a <ReflexProvider>
// error-next-line
Roact.mount(<TodosApp />, container);
```

Roact Reflex uses [Roact contexts](https://roblox.github.io/roact/advanced/context/) to pass the producer to your components and allow them to use Reflex Hooks. If you don't wrap your root elements in a `<ReflexProvider>`, your components won't be able to access the producer.

If your app or components use Reflex, you should wrap your root elements in a `<ReflexProvider>`:

```tsx
function TodosApp() {
	const todos = useSelector(selectTodos);
	// ...
}

// ✅ You can use the root producer in your components
Roact.mount(
	// highlight-start
	<ReflexProvider producer={producer}>
		<TodosApp />
	</ReflexProvider>,
	// highlight-end
	container,
);
```

---

### My component is re-rendering too often

If your component is re-rendering too often, you might be using a selector that returns a new object every time it's called. Remember that Reflex uses [reference equality (`===`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality) to compare the previous and next values, so if your selector returns a new object, Reflex will assume an update happened and re-render.

Here's an example of a **bad** selector that returns a new object every time it's called:

```ts
const selectTodos = (state: RootState) => {
	state.todos;
};

// error-next-line
// 🔴 This selector creates a new array every time it's called
// error-next-line
const selectTodosDone = (state: RootState) => {
	// error-next-line
	return state.todos.filter((todo) => todo.done);
	// error-next-line
};
```

Because selectors are called every time the producer updates, and `selectTodosDone` works by creating a new array, Reflex assumes that the value changed. This will cause the component to re-render with the new value, even if the underlying `todos` state didn't change.

To fix this, you can use [`createSelector`](../reflex/create-selector) to memoize your selectors and prevent unnecessary re-renders:

```ts
import { createSelector } from "@rbxts/roact-reflex";

const selectTodos = (state: RootState) => {
	state.todos;
};

// highlight-start
// ✅ This selector is memoized, and won't re-render unless 'todos' changes
const selectTodosDone = createSelector([selectTodos], (todos) => {
	return todos.filter((todo) => todo.done);
});
// highlight-end
```
