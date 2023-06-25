---
description: Learn how to use the useProducer hook to dispatch actions.
---

# Using the Producer

Roact Reflex provides useful hooks similar to [React Redux](https://react-redux.js.org/) that allow you to access the root producer, its state, and to dispatch actions.

:::note what you'll learn

-   📂 How to set up Roact Reflex in your app
-   ⚡️ How to dispatch actions
-   📦 How to use a pre-typed `useProducer` hook

:::

---

## Setting up Roact Reflex

To use Roact Reflex, you must first pass your [root producer](../organizing-producers#the-root-producer) to the [`<ReflexProvider>`](../../reference/roact-reflex/reflex-provider) component. By doing this, you enable Reflex Hooks for your Roact app.

You can render the `<ReflexProvider>` component anywhere in your app, but it must be rendered above any components that use the Hooks. We recommend putting it at the top-level of your app, wrapping your root components.

```tsx
Roact.mount(
	// highlight-start
	<ReflexProvider producer={producer}>
		<App />
	</ReflexProvider>,
	// highlight-end
	playerGui,
);
```

---

## Dispatching actions

The [`useProducer`](../../reference/roact-reflex/use-producer) hook lets you access the producer and dispatch actions to the root producer. You can use this hook to dispatch actions from any component that is wrapped in a [`<ReflexProvider>`](../../reference/roact-reflex/reflex-provider).

Say our root producer has a `todos` slice that contains actions to add a todo:

```ts title="todos.ts" showLineNumbers
import { createProducer } from "@rbxts/reflex";

interface TodosState {
	readonly list: readonly string[];
}

const initialState: TodosState = {
	list: [],
};

export const todosSlice = createProducer(initialState, {
	addTodo: (state, todo: string) => ({
		...state,
		list: [...state.list, todo],
	}),
});
```

We can use the `useProducer` hook to dispatch the `addTodo` action from a component:

```tsx title="Button.tsx" showLineNumbers
import Roact from "@rbxts/roact";
import { useProducer } from "@rbxts/roact-reflex";
import { RootProducer } from "./producer";

function Button() {
	// highlight-next-line
	const producer = useProducer<RootProducer>();

	return (
		<textbutton
			Text="Add Todo"
			Size={new UDim2(0, 100, 0, 50)}
			Event={{
				// highlight-next-line
				Activated: () => producer.addTodo("Hello, world!"),
			}}
		/>
	);
}
```

:::tip

You can also _destructure_ the `useProducer` hook to get the `addTodo` action directly:

```tsx title="Button.tsx"
function Button() {
    const { addTodo } = useProducer<RootProducer>();
    // ...
```

:::

---

## Pre-typed `useProducer` hook

If you want to use the [`useProducer`](../../reference/roact-reflex/use-producer) hook without passing the type of your root producer, you can use the `UseProducerHook` type to create a pre-typed hook:

```ts
import { UseProducerHook, useProducer } from "@rbxts/roact-reflex";
import { RootProducer } from "./producer";

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
```

---

## Why use a hook instead of importing the producer?

You may be wondering why we use a hook to access the producer instead of just importing it directly. Some good reasons to use a hook are:

1.  It makes your components more **reusable**
2.  It allows you more **flexibility** in testing
3.  Your components are easier to test in **isolation**

If you use a [`ReflexProvider`](../../reference/roact-reflex/reflex-provider) to pass the root producer, you can create a mock producer and pass it to your components in tests. Your components can be easier to isolate and run tests on.

Using a hook also makes your components more reusable. If you import the producer directly, you might need to refactor your component when moving it to a different app that has a different producer set up.

[Read more on Redux's FAQ →](https://redux.js.org/faq/store-setup#can-or-should-i-create-multiple-stores-can-i-import-my-store-directly-and-use-it-in-components-myself)

---

## Subscribing to state

To learn how to subscribe to state, we'll learn about the [`useSelector`](../../reference/roact-reflex/use-selector) hook on the next page.

---

## Summary

-   Make sure to pass your root producer to the [`<ReflexProvider>`](../../reference/roact-reflex/reflex-provider) component
-   You can use the [`useProducer`](../../reference/roact-reflex/use-producer) hook to access the root producer and dispatch actions
-   Using a hook to access the producer makes your components more reusable and easier to test
