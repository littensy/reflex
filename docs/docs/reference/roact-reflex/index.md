---
description: API Reference for Roact Reflex, bindings for Reflex and Roact Hooked.
---

# Roact Reflex

The official bindings for Reflex and Roact Hooked are available under [`@rbxts/roact-reflex`](https://www.npmjs.com/package/@rbxts/roact-reflex).

Luau is not supported by Roact Hooked or Roact Reflex.

[See the source code on GitHub →](https://github.com/littensy/roact-reflex)

---

## Components

Roact Reflex allows you to use your root producer from Roact function components. It exposes a component that you can use to specify the producer for Hooks to use:

-   [`<ReflexProvider>`](reflex-provider) enables Reflex Hooks for a producer.
    -   [Setting up Roact Reflex](reflex-provider#setting-up-roact-reflex)
    -   [Using other providers with `ReflexProvider`](reflex-provider#using-other-providers-with-reflexprovider)

```tsx
Roact.mount(
	<ReflexProvider producer={producer}>
		<App />
	</ReflexProvider>,
	playerGui,
);
```

---

## Hooks

You can use Hooks to read and subscribe to state, or to dispatch actions. Use these Hooks in function components that are wrapped in a [`<ReflexProvider>`](reflex-provider).

### Context Hooks

Use these Hooks to access the root producer and dispatch actions:

-   [`useProducer`](use-producer) lets components read and dispatch actions to the root producer.
    -   [Dispatching actions](use-producer#dispatching-actions)
    -   [Typed `useProducer` hook](use-producer#typed-useproducer-hook)

```tsx
function Button() {
    const { increment } = useProducer();
    // ...
```

### State Hooks

Use these Hooks to read and subscribe to state:

-   [`useSelector`](use-selector) lets a component subscribe to a Reflex producer.
    -   [Subscribing to a producer's state](use-selector#subscribing-to-a-producers-state)
    -   [Custom equality comparison](use-selector#custom-equality-comparison)
    -   [Using selectors with curried arguments](use-selector#using-selectors-with-curried-arguments)
-   [`useSelectorCreator`](use-selector-creator) lets you call `useSelector` with a [selector factory](../reflex/create-selector#selector-factories).
    -   [Subscribing to state with selector factories](use-selector-creator#subscribing-to-state-with-selector-factories)

```tsx
function Counter() {
    const count = useSelector((state) => state.count);
    // ...
```
