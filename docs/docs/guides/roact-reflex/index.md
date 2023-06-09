---
description: Using Roact Reflex, bindings for Reflex and Roact Hooked.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Roact Reflex

Reflex offers bindings for [Roact](https://roblox.github.io/roact/) and [Roact Hooked](https://github.com/littensy/rbxts-roact-hooked) that allow you to use Hooks to read and dispatch actions to a Reflex producer from a component.

---

## Quick Start

The official bindings for Reflex and Roact Hooked are available under [`@rbxts/roact-reflex`](https://www.npmjs.com/package/@rbxts/roact-reflex). Currently, there is no support for Luau projects.

[See the source code on GitHub →](https://github.com/littensy/roact-reflex)

<Tabs>
<TabItem value="npm" default>

```bash title="Terminal"
npm install @rbxts/roact-reflex
```

</TabItem>
<TabItem value="Yarn">

```bash title="Terminal"
yarn add @rbxts/roact-reflex
```

</TabItem>
<TabItem value="pnpm">

```bash title="Terminal"
pnpm add @rbxts/roact-reflex
```

</TabItem>
</Tabs>

---

## Components

Roact Reflex allows you to use your root producer from Roact function components. It exposes a component that you can use to specify the producer for Hooks to use:

-   [`<ReflexProvider>`](docs/reference/roact-reflex/reflex-provider) enables Reflex Hooks for a producer.
    -   [Setting up Roact Reflex](docs/reference/roact-reflex/reflex-provider#setting-up-roact-reflex)
    -   [Using other providers with `ReflexProvider`](docs/reference/roact-reflex/reflex-provider#using-other-providers-with-reflexprovider)

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

You can use Hooks to read and subscribe to state, or to dispatch actions. Use these Hooks in function components that are wrapped in a [`<ReflexProvider>`](docs/reference/roact-reflex/reflex-provider).

### Context Hooks

Use these Hooks to access the root producer and dispatch actions:

-   [`useProducer`](docs/reference/roact-reflex/use-producer) lets components read and dispatch actions to the root producer.
    -   [Dispatching actions](docs/reference/roact-reflex/use-producer#dispatching-actions)
    -   [Typed `useProducer` hook](docs/reference/roact-reflex/use-producer#typed-useproducer-hook)

```tsx
function Button() {
    const { increment } = useProducer();
    // ...
```

### State Hooks

Use these Hooks to read and subscribe to state:

-   [`useSelector`](docs/reference/roact-reflex/use-selector) lets a component subscribe to a Reflex producer.
    -   [Subscribing to a producer's state](docs/reference/roact-reflex/use-selector#subscribing-to-a-producers-state)
    -   [Custom equality comparison](docs/reference/roact-reflex/use-selector#custom-equality-comparison)
    -   [Using selectors with curried arguments](docs/reference/roact-reflex/use-selector#using-selectors-with-curried-arguments)
-   [`useSelectorCreator`](docs/reference/roact-reflex/use-selector-creator) lets you call `useSelector` with a [selector factory](docs/reference/reflex/create-selector#selector-factories).
    -   [Subscribing to state with selector factories](docs/reference/roact-reflex/use-selector-creator#subscribing-to-state-with-selector-factories)

```tsx
function Counter() {
    const count = useSelector((state) => state.count);
    // ...
```

---

## Guides

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
