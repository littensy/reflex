---
sidebar_position: 2
description: Get the root producer from a function component with useProducer.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# useProducer

`useProducer` is a Reflex Hook that lets you use the [producer](../reflex/producer) you passed to [`<ReflexProvider>`](reflex-provider) from your component.

```ts
const producer = useProducer<Producer>();
```

<TOCInline toc={toc} />

---

## Reference

### `useProducer<T>()`

Call `useProducer` from a function component to access the producer for the app.

```ts
import { useProducer } from "@rbxts/roact-reflex";
import { RootProducer } from "./producer";

function Button() {
	const producer = useProducer<RootProducer>();
	// ...
}
```

[See more examples below.](#usage)

#### Parameters

`useProducer` takes no parameters.

#### Returns

`useProducer` returns the [Reflex producer](../reflex/producer) passed to the [`<ReflexProvider>`](reflex-provider) component. If there is more than one provider, the value is the producer from the closest provider above the component in the tree.

:::info caveats

-   **This is intended for dispatching actions.** If you want to subscribe to state, prefer [`useSelector`](use-selector) instead.

-   **Your app should only have one root producer.** Roact Reflex expects only _one_ producer to be used in your components. [Learn more about using a root producer.](../reflex/combine-producers#using-multiple-producers)

:::

---

## Usage

### Dispatching actions

Call `useProducer` from a component to reference your app's [producer](../reflex/producer).

```ts
import { useProducer } from "@rbxts/roact-reflex";
import { RootProducer } from "./producer";

function Button() {
	// highlight-next-line
	const producer = useProducer<RootProducer>();
	// ...
}
```

`useProducer` returns the [producer](../reflex/producer) you passed to the [`<ReflexProvider>`](reflex-provider) component. It doesn't matter how many components are between your component and the provider because of Roact's [context](https://roblox.github.io/roact/advanced/context/).

You will mainly use this to dispatch actions to your producer. As a shorthand, you can _destructure_ the producer into its actions:

```tsx
function Button() {
	// highlight-next-line
	const { increment } = useProducer<RootProducer>();

	return <textbutton Event={{ Activated: () => increment(1) }} />;
}
```

[To pass a producer to your components, see `<ReflexProvider>`.](reflex-provider)

---

### Pre-typed `useProducer` hook

On its own, [`useProducer`](#useproducert) doesn't know what type of producer you're using. It receives a generic type parameter that lets you specify the type of the producer, but that can be repetitive.

To reduce the amount of typing you have to do, we recommend using the `UseProducerHook` type:

```ts
import { UseProducerHook, useProducer } from "@rbxts/roact-reflex";

// highlight-next-line
const useAppProducer: UseProducerHook<RootProducer> = useProducer;
```

---

### Subscribing to state

[To access the state from a Roact function component, see `useSelector`.](use-selector)

---

## Troubleshooting

### I'm getting an error: "`useProducer` must be called from within a `ReflexProvider`"

This error means that you're trying to use [`useProducer`](#useproducert) in a function component that isn't wrapped in a [`<ReflexProvider>`](reflex-provider):

```tsx
function App() {
	const producer = useProducer<RootProducer>();
	// ...
}

// error-next-line
// 🔴 You need to wrap your root elements in a <ReflexProvider>
// error-next-line
Roact.mount(<App />, container);
```

Roact Reflex uses [Roact contexts](https://roblox.github.io/roact/advanced/context/) to pass the producer to your components and allow them to use Reflex Hooks. If you don't wrap your root elements in a `<ReflexProvider>`, your components won't be able to access the producer.

If your app or components use Reflex, you should wrap your root elements in a `<ReflexProvider>`:

```tsx
function App() {
	const producer = useProducer<RootProducer>();
	// ...
}

// ✅ You can use the root producer in your components
Roact.mount(
	// highlight-start
	<ReflexProvider producer={producer}>
		<App />
	</ReflexProvider>,
	// highlight-end
	container,
);
```

### My component won't stop dispatching actions

If your component is dispatching actions in a loop, it's likely that your action is running within the body of the component, or it indirectly triggers itself. This can become an issue if components that depend on the state are re-rendered every time the action is dispatched:

```ts
function Button() {
	const { increment } = useProducer<RootProducer>();
	const counter = useSelector((state) => state.counter);

	// error-next-line
	// 🔴 This action updates counter and causes a re-render loop
	// error-next-line
	increment(1);
}
```

To fix this, you can use [`useEffect`](https://roblox.github.io/roact/advanced/hooks/#useeffect) to dispatch the action when a specific dependency changes:

```ts
function Button() {
	const { increment } = useProducer<RootProducer>();
	const counter = useSelector((state) => state.counter);

	// highlight-start
	// ✅ This action is dispatched once when the component mounts
	useEffect(() => {
		increment(1);
	}, []);
	// highlight-end
}
```
