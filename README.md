<h1 align="center">
	<img src="public/logo.png" alt="Reflex" width="200" />
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

You can use Reflex with Roact on the client, or to manage your game's state on the server.

&nbsp;

## 📦 Installation

This package is only available for Roblox TypeScript on NPM:

```bash
npm install @rbxts/reflex
```

```bash
pnpm add @rbxts/reflex
```

&nbsp;

## 📚 Documentation

### 🎂 Producers

**Producers** are the state containers that manage state updates and observe changes.

**`createProducer()`** takes an initial state and a table of action callbacks. Like Rodux, all state is immutable, so action callbacks should return a new state table if a change is needed.

```ts
const myProducer = createProducer({ count: 0 } satisfies State, {
	increment: (state) => ({ ...state, count: state.count + 1 }),
	decrement: (state) => ({ ...state, count: state.count - 1 }),
	set: (state, count: number) => ({ ...state, count }),
});

myProducer.getState(); // { count: 0 }
myProducer.increment(); // { count: 1 }
```

### 🍰 Selectors

**Selectors** are functions that take state as an input and return a select portion of it. You can use them to observe a subset of your state, or you can derive new values from it. They're also used in producers to observe state changes.

Selectors are called often during state changes, so it's best to memoize your selectors when deriving unique values or performing an expensive calculation. For that reason, Reflex provides a `createSelector` function that memoizes selectors for you.

```ts
const selectCount = (state: State) => state.count;

const selectWord = createSelector([selectCount] as const, (count) => {
	return ["E".rep(count)];
});

myProducer.set(10);
myProducer.select(selectWord); // ["EEEEEEEEEE"]
myProducer.select(selectWord) === myProducer.select(selectWord); // true
```

You might also have a selector that depends on outside parameters. In that case, I recommend this pattern:

```ts
const createSelectWord = (word: string) => {
	return createSelector([selectCount] as const, (count) => {
		return word.rep(count);
	});
};
```

### 🔮 Observing state

You can observe changes to subsets of your state using the `observe`, `once`, and `wait` methods. Additionally, the `subscribe` method allows you to observe changes to the entire state.

Although dispatchers update state synchronously, observers are deferred until the next frame. This allows you to observe multiple state changes in a single frame.

```ts
const unsubscribe = myProducer.observe(selectCount, (count, prevCount) => {
	print(`Count changed from ${prevCount} to ${count}`);
});

for (const _ of $range(1, 10)) {
	myProducer.increment();
}

unsubscribe();
```

```ts
// Count changed from 0 to 10
```

### 🖥️ Managing multiple producers

Reflex allows you to organize your state into multiple producers, and then combine them into a single root producer.

The `combineProducers()` function takes a table of producers, and returns a new producer that combines the states and dispatchers. Any dispatchers called in the combined producer will be forwarded to every producer in the table.

> **Warning**
> Dispatchers called on individual producers will not be tracked by the combined producer!
> To update the state, you should call it through the combined producer.

```ts
const producerA = createProducer({ count: 0 } satisfies StateA, {
	shared: (state) => ({ ...state, count: state.count + 1 }),
	privateA: (state) => ({ ...state, count: state.count + 1 }),
});

const producerB = createProducer({ count: 0 } satisfies StateB, {
	shared: (state) => ({ ...state, count: state.count + 1 }),
	privateB: (state) => ({ ...state, count: state.count + 1 }),
});

const combinedProducer = combineProducers({
	a: producerA,
	b: producerB,
});

combinedProducer.shared(); // { a: { count: 1 }, b: { count: 1 } }
combinedProducer.privateA(); // { ..., a: { count: 2 } }
combinedProducer.privateB(); // { ..., b: { count: 2 } }
```

### ⚛️ Roact

Reflex offers native support for [`@rbxts/roact-hooked`](https://npmjs.com/package/@rbxts/roact-hooked) with the `useSelector()` and `useProducer()` hooks. Using them requires setting up a `ReflexProvider` at the root of your Roact tree.

If you don't want to use generics to get the Producer type you want, Reflex exports the `UseSelectorHook` and `UseProducerHook` types to make it easier:

```tsx
// use-app-producer.ts
export const useAppProducer: UseSelectorHook<AppProducer> = useProducer;
```

```tsx
// App.tsx
export default function App() {
	const { increment, decrement } = useAppProducer();
	const count = useSelector(selectCount);

	return (
		<textbutton
			Text={`Count: ${count}`}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={new UDim2(0, 100, 0, 50)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Event={{
				Activated: increment,
				MouseButton2Click: decrement,
			}}
		/>
	);
}
```

```tsx
// main.client.tsx
Roact.mount(
	<ReflexProvider producer={myProducer}>
		<App />
	</ReflexProvider>,
);
```

You should avoid passing a newly created selector directly to useSelector, though (i.e. `useSelector(createSelectWord("E"))`). If it uses `createSelector`, it will create a new selector every time the component renders, and reset the cache. Instead, you can use the `useSelectorCreator()` hook to memoize the selector:

```tsx
const createSelectWord = (word: string) => {
	return createSelector([selectCount] as const, (count) => {
		return word.rep(count);
	});
};
```

```ts
const word = useSelectorCreator(createSelectWord, "E");
```

### 🛠️ Middleware

Producers have an `enhance()` method that allows you to add custom functionality to your producers. The enhancer you will most likely use is `applyMiddleware()`, which allows you to add middleware to your producers.

Middleware are higher-order functions called before every dispatcher, and can be used to add logging, cancel actions, or to perform side effects. Middleware functions are passed the next function and an action object, which holds the dispatcher and the arguments passed to it.

```ts
export const loggerMiddleware: Middleware = (producer) => (done) => (action) => {
	print(`[loggerMiddleware]: Dispatching ${action.type}`);
	const newState = done(action);
	print("[loggerMiddleware]: New state:", producer.getState());
	return newState;
};

const producer = createProducer(initialState, {
	// ...
}).enhance(applyMiddleware(loggerMiddleware));
```

Enhance can also be called on a combined producer:

```ts
const combinedProducer = combineProducers({
	a: producerA,
	b: producerB,
}).enhance(applyMiddleware(loggerMiddleware));
```

&nbsp;

## 🚧 Roadmap

This project is still in early development, and is missing some features that I plan to add in the future:

-   [x] Middleware
-   [x] Logging
-   [ ] Standardized server-to-client syncing
-   [ ] No `as const` requirement for createSelector

&nbsp;

## 📝 License

Reflex is licensed under the [MIT License](LICENSE.md).
