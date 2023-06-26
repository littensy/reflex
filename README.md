<h1 align="center">
	<a href="https://www.npmjs.com/package/@rbxts/reflex">
		<img src="public/logo.png" alt="Reflex" width="200" />
	</a>
	<br />
	<b>Reflex</b>
</h1>

<div align="center">

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/littensy/reflex/ci.yml?branch=master&style=for-the-badge&logo=github)
[![npm version](https://img.shields.io/npm/v/@rbxts/reflex.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/reflex)
[![npm downloads](https://img.shields.io/npm/dt/@rbxts/reflex.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/reflex)
[![GitHub license](https://img.shields.io/github/license/littensy/reflex?style=for-the-badge)](LICENSE.md)

</div>

---

&nbsp;

## ♻️ Reflex

**Reflex** is a simple state container inspired by [Rodux](https://github.com/roblox/rodux) and [Silo](https://github.com/sleitnick/rbxts-silo), designed to be an all-in-one solution for managing and reacting to state in Roblox games.

You can use Reflex with Roact on the client with [`@rbxts/roact-reflex`](https://npmjs.com/package/@rbxts/roact-reflex), or use it to manage your game's state on the server.

&nbsp;

## 📦 Installation

This package is available for Roblox TypeScript and [Wally](https://wally.run/package/littensy/reflex).

```bash
npm install @rbxts/reflex
yarn add @rbxts/reflex
pnpm add @rbxts/reflex
```

&nbsp;

## 📚 Quick Start

[Take me to the documentation →](https://littensy.github.io/reflex)

### ⚡️ Start using Reflex

Where Rodux uses stores, reducers, and actions, Reflex revolves around **actions** and [**producers**](https://littensy.github.io/reflex/docs/reference/reflex/producer). Create a producer with an initial state and a set of actions, and you're ready to go.

```ts
import { createProducer } from "@rbxts/reflex";

interface State {
	count: number;
}

const initialState: State = {
	count: 0,
};

const producer = createProducer(initialState, {
	increment: (state) => ({ ...state, count: state.count + 1 }),
	reset: (state) => ({ ...state, count: 0 }),
});
```

### ✨ Use your producer anywhere

Reflex was designed to make managing your state simple and straightforward. Dispatch actions by calling the action directly, and read & subscribe to state with selectors.

```ts
const selectCount = (state: State) => state.count;

producer.subscribe(selectCount, (count) => {
	print(`The count is now ${count}`);
});

producer.increment(); // The count is now 1
```

&nbsp;

## ⚛️ Roact Reflex

The official bindings for Reflex and Roact Hooked are available under [`@rbxts/roact-reflex`](https://www.npmjs.com/package/@rbxts/roact-reflex). Currently, there is no support for Luau projects.

[See the source code on GitHub →](https://github.com/littensy/roact-reflex)

### ⚙️ Components

Roact Reflex allows you to use your root producer from Roact function components. It exposes a component that you can use to specify the producer for Hooks to use:

-   [`<ReflexProvider>`](https://littensy.github.io/reflex/docs/reference/roact-reflex/reflex-provider) enables Reflex Hooks for a producer.

```tsx
Roact.mount(
	<ReflexProvider producer={producer}>
		<App />
	</ReflexProvider>,
	playerGui,
);
```

### 🪝 Context Hooks

You can use Hooks to read and subscribe to state, or to dispatch actions. Use these Hooks in function components that are wrapped in a [`<ReflexProvider>`](https://littensy.github.io/reflex/docs/reference/roact-reflex/reflex-provider).

Use these Hooks to access the root producer and dispatch actions:

-   [`useProducer`](https://littensy.github.io/reflex/docs/reference/roact-reflex/use-producer) lets components read and dispatch actions to the root producer.

```tsx
function Button() {
    const { increment } = useProducer();
    // ...
```

### 🪝 State Hooks

Use these Hooks to read and subscribe to state:

-   [`useSelector`](https://littensy.github.io/reflex/docs/reference/roact-reflex/use-selector) lets a component subscribe to a Reflex producer.
-   [`useSelectorCreator`](https://littensy.github.io/reflex/docs/reference/roact-reflex/use-selector-creator) lets you call `useSelector` with a [selector factory](https://littensy.github.io/reflex/docs/reference/reflex/create-selector#selector-factories).

```tsx
function Counter() {
    const count = useSelector((state) => state.count);
    // ...
```

&nbsp;

## 📝 License

Reflex is licensed under the [MIT License](LICENSE.md).
