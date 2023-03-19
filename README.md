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

```console
$ npm install @rbxts/reflex
```

```console
$ pnpm add @rbxts/reflex
```

&nbsp;

## 📚 Documentation

### 🎂 Producers

**Producers** are the state containers that manage state updates and subscribe to changes.

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
myProducer.getState(selectWord); // ["EEEEEEEEEE"]
myProducer.getState(selectWord) === myProducer.getState(selectWord); // true
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

You can observe changes to subsets of your state using the `subscribe`, `once`, and `wait` methods. These methods take a selector and a callback, and call the callback whenever the selected state changes.

Although dispatchers update state synchronously, the events are deferred until the next frame. This allows you to observe multiple state changes in a single frame.

```ts
const unsubscribe = myProducer.subscribe(selectCount, (count, prevCount) => {
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
> To update the state, you should get the dispatcher from the combined producer.

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
export const useAppProducer: UseProducerHook<AppProducer> = useProducer;
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

When using selector creators, you should avoid calling them in your render method (i.e. `useSelector(createSelectWord("E"))`), since it creates a new selector every time the component renders and risks excessive re-renders. Instead, you can use the `useSelectorCreator()` hook to memoize the selector:

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

Middleware are higher-order functions called before every dispatcher, and can be used to add logging, cancel actions, or to perform side effects.

They're called with the following arguments:

-   `dispatch`: The next middleware in the chain, or the dispatcher if this is the last middleware.
-   `resolve`: A function that returns the name of the dispatcher that was called.
-   `producer`: The producer that the dispatcher was called on.

Middleware can be used to log every action:

```ts
export const loggerMiddleware: Middleware =
	(dispatch, resolve, producer) =>
	(...args) => {
		print(`[loggerMiddleware]: Dispatching ${resolve()}`);
		const result = dispatch(...args);
		print("[loggerMiddleware]: New state:", producer.getState());
		return result;
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

### 🤝 Syncing server and client

With enhancers and middleware, you can easily sync the state between the server and client. The `createBroadcaster()` and `createBroadcastReceiver()` functions allow you to share dispatcher calls with the client while filtering out actions that are only meant for the server.

#### ⚙️ Setting up

Before you can use them, you should set up a shared producer table that contains all of the producers that you want to sync:

```ts
// shared/producers.ts
export type SharedState = CombineStates<typeof sharedProducers>;

export const sharedProducers = { a: producerA, b: producerB };

// client/producers.ts
export const producer = combineProducers({ ...sharedProducers, c: producerC });

// server/producers.ts
export const producer = combineProducers({ ...sharedProducers, d: producerD });
```

#### 📡 Broadcasting to the client

To automate sending actions to the client, you can use the `createBroadcaster()` function on the server. It returns a broadcaster that can retrieve the current state for a player, and intercept actions with a middleware.

This example uses the `@rbxts/net` library:

```ts
// server/main.server.ts
const broadcaster = createBroadcaster({
	// The producer map that contains all of the producers you want to sync
	producers: sharedProducers,

	// The function that sends the action to the clients
	broadcast: (players, actions) => {
		remote.Server.Get("broadcastDispatcher").SendToPlayers(players, actions);
	},
});

// Players don't receive dispatches until they initialize their producer with
// the initial state from the server
remote.Server.OnFunction("getServerState", (player, actions) => {
	return broadcaster.playerRequestedState(player);
});

// Apply the middleware to intercept actions and send them to the client
producer.enhance(applyMiddleware(broadcaster.middleware));
```

#### 📡 Receiving actions from the server

You're not done yet! You also need to set up the client to receive actions from the server. This is done with the `createBroadcastReceiver()` function, which returns a `dispatch()` callback and an enhancer.

> **Warning**
> Be careful not to load remotes in your producer files!
> If you test UI with a plugin, your networking library might try to connect RemoteEvents as a side effect of importing a producer.

```ts
// client/main.client.ts
const broadcastReceiver = createBroadcastReceiver({
	// The function that retrieves the initial state from the server. The result
	// gets merged with the current state, so you can use your producer before
	// the server state gets added!
	getServerState: async () => {
		return remote.Client.Get("getServerState").CallServerAsync();
	},
});

// Run the dispatchers that were sent from the server
remote.Client.On("broadcastDispatcher", (actions) => {
	broadcastReceiver.dispatch(actions);
});

// Apply the enhancer so the receiver can hydrate the state
producer.enhance(broadcastReceiver.enhancer);
```

&nbsp;

## 🚧 Roadmap

This project is still in early development! Here are some of the things that are planned:

-   [x] Middleware
-   [x] Logging
-   [x] Standardized server-to-client syncing
-   [ ] Example project (for now, see the [test](test/src) folder)

&nbsp;

## 📖 Terminology

-   ♻️ **Producer**: A producer is a table that contains state events and dispatchers.

-   🎂 **State**: An immutable table that represents the current state of the application.

-   🍰 **Selector**: A function that returns a subset of the state.

-   ⚙️ **Action**: A function that, given the current state and some parameters, returns a new state.

-   ⚡️ **Dispatcher**: The callback in the producer that updates the state and is based on an action.

-   📡 **Broadcast**: The interfaces that allow you to sync server and client state.

&nbsp;

## 📝 License

Reflex is licensed under the [MIT License](LICENSE.md).
