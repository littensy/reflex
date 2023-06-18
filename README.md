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

## 📚 Documentation

### 🎂 Producers

**Producers** are state containers that manage updating and observing state.

**`createProducer()`** takes an initial state and a table of action callbacks. State should be immutable, so action callbacks should return a new state table if a change is made.

Note that in Luau, dispatchers are called with dot notation (`myProducer.increment()`).

```ts
const producer = createProducer(initialState, {
	increment: (state) => ({ ...state, count: state.count + 1 }),
	decrement: (state) => ({ ...state, count: state.count - 1 }),
	set: (state, count: number) => ({ ...state, count }),
});

producer.getState(); // { count: 0 }
producer.increment(); // { count: 1 }
```

### 🍰 Selectors

**Selectors** are functions that take state as an input and return a select portion of it. You can use them to observe a subset of your state, or you can derive new values from it. They're also used in producers to observe state changes.

Selectors are called on every state update to compare changes in state. This is not an issue if your selector only indexes the state, but if it derives new data or performs expensive calculations, this is not ideal. To ensure that your selectors are performant, you should memoize them using the `createSelector` function.

```ts
const selectUserIds = (state: State) => state.userIds;

const selectPlayers = createSelector([selectUserIds] as const, (userIds) => {
	return userIds.mapFiltered((userId) => Players.GetPlayerByUserId(userId));
});

producer.playerAdded(player.UserId); // { userIds: [2] }
producer.getState(selectPlayers); // [John Doe]
producer.getState(selectPlayers) === producer.getState(selectPlayers); // true
```

You might also have a selector that depends on outside parameters. In that case, I recommend this pattern:

```ts
export const selectPlayersOnTeam = (team: Team) => {
	return createSelector([selectPlayers] as const, (players) => {
		return players.filter((player) => player.Team === team);
	});
};

// General usage
producer.subscribe(selectPlayersOnTeam(redTeam), print);

// With roact-reflex
const players = useSelectorCreator(selectPlayersOnTeam, redTeam);
```

### 🔮 Observing state

You can observe changes to subsets of your state using the `subscribe`, `once`, and `wait` methods. These methods take a selector and a callback, and call the callback whenever the selected state changes.

Although dispatchers update state synchronously, the events are deferred until the next frame. This allows you to observe multiple state changes in a single frame.

Additionally, the `once` and `wait` methods take an optional second `predicate` parameter. If provided, the listener will only run once the predicate returns true.

```ts
producer.subscribe(selectCounter, (counter, prevCounter) => {
	print(`Counter changed from ${prevCounter} to ${counter}`);
});

producer.once(selectCounter, (counter, prevCounter) => {
	print(`Counter changed once from ${prevCounter} to ${counter}`);
});

producer
	.wait(selectCounter, (count) => count === 10)
	.then((counter) => {
		print(`Counter changed once to ${counter}`);
	});

for (const _ of $range(1, 10)) {
	counterProducer.increment();
}
```

```ts
// Count changed from 0 to 10
// Count changed once from 0 to 10
// Count changed once to 10
```

### 🔭 Tracking items in an array

You might want to create and track unique items in your state, like matches in a matchmaking queue. You can use the `observe` method to track the addition and eventual removal of items in an object.

The `observe` method takes a selector, a discriminator to track objects, and an observer callback. The selector should return an object/array containing items, and the observer will be called whenever an item is added. The observer can return a cleanup callback, which will be called when the item is removed.

It returns an unsubscribe function, which you can call to stop observing state changes and destroy all observers.

```ts
const matchProducer = createProducer(initialState, {
	add: (state, id: number) => ({
		...state,
		matches: { ...state.matches, [id]: { id } },
	}),
});

const unsubscribe = matchProducer.observe(
	(state) => state.matches,
	(match) => match.id,
	(match) => {
		print(`Match ${match.id} was added`);
		return () => print(`Match ${match.id} was removed`);
	},
);

matchProducer.add("1");
```

The discriminator parameter is optional, and defaults to the item itself. This means that if you're tracking primitives, you can omit the discriminator.

```ts
const matchProducer = createProducer([1, 2, 3], {
	add: (state, id: number) => [...state, id],
});

matchProducer.observe(selectMatches, (id) => {
	print(`Match ${id} was added`);
	return () => print(`Match ${id} was removed`);
});
```

### 🖥️ Managing multiple producers

Reflex allows you to organize your state into multiple producers, and then combine them into a single root producer. The `combineProducers()` function takes a table of producers, and returns a new producer that re-uses the state and actions from the original producers.

Actions from different producers that have the same name are combined, so calling their dispatchers will call both actions, as seen below in the `shared` action.

> **Warning**
> Updating the state of the combined producer will not update the state of the original producers, and vice versa.
> You should only use the combined producer to dispatch actions.

```ts
const fooProducer = createProducer(initialState, {
	incrementFoo: (state) => ({ ...state, count: state.count + 1 }),
	shared: (state) => ({ ...state, count: state.count + 1 }),
});

const barProducer = createProducer(initialState, {
	incrementBar: (state) => ({ ...state, count: state.count + 1 }),
	shared: (state) => ({ ...state, count: state.count + 1 }),
});

const producer = combineProducers({
	foo: fooProducer,
	bar: barProducer,
});

producer.getState(); // { foo: { count: 0 }, bar: { count: 0 } }
producer.incrementFoo(); // { foo: { count: 1 }, bar: { count: 0 } }
producer.incrementBar(); // { foo: { count: 1 }, bar: { count: 1 } }
```

### ⚛️ Roact

Reflex offers support for [`@rbxts/roact-hooked`](https://npmjs.com/package/@rbxts/roact-hooked) with [`@rbxts/roact-reflex`](https://npmjs.com/package/@rbxts/roact-reflex). Using roact-reflex hooks requires setting up a `ReflexProvider` at the root of your Roact tree.

If you don't want to use generics to get the Producer type you want, Reflex exports the `UseSelectorHook` and `UseProducerHook` types to make it easier:

```tsx
export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;
```

```tsx
export function App() {
	const { increment, decrement } = useRootProducer();

	const count = useRootSelector((state) => state.count);

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
Roact.mount(
	<ReflexProvider producer={producer}>
		<App />
	</ReflexProvider>,
);
```

When using selector creators, you should avoid creating them in your render method (i.e. `useSelector(selectPlayersOnTeam(redTeam))`), since it creates a new selector every time the component renders and risks excessive re-renders. Instead, you can use the `useSelectorCreator()` hook to memoize the selector:

```tsx
export const selectPlayersOnTeam = (team: Team) => {
	return createSelector([selectPlayers] as const, (players) => {
		return players.filter((player) => player.Team === team);
	});
};
```

```ts
const players = useSelectorCreator(selectPlayersOnTeam, redTeam);
```

### 🛠️ Middleware

Middleware are higher-order functions that can be used to add logging, cancel dispatches, or to perform side effects. They are structured as such:

```ts
// Called once when the middleware is applied to a producer
export const middleware: ProducerMiddleware = (producer) => {
	// Called for each dispatcher on this producer
	return (dispatch, name) => {
		// Called every time this dispatcher is called
		return (...args) => {
			return dispatch(...args);
		};
	};
};
```

Middleware can be used to log every dispatch call:

```ts
export const loggerMiddleware: Middleware = (producer) => {
	print("Initial state", producer.getState());
	return (dispatch, name) => {
		return (...args) => {
			print(`Dispatching ${name} with args`, ...args);
			return dispatch(...args);
		};
	};
};

producer.applyMiddleware(loggerMiddleware);
```

If you have a combined producer, you should prefer to apply your middleware to the combined producer:

```ts
export const producer = combineProducers({
	foo: fooProducer,
	bar: barProducer,
});

producer.applyMiddleware(loggerMiddleware);
```

### 🤝 Syncing server and client

With Reflex, you can easily sync the state between the server and client. The `createBroadcaster()` and `createBroadcastReceiver()` functions allow you to broadcast dispatcher calls to clients while filtering out state updates that are not meant to be shared.

#### ⚙️ Setup

Before you can use them, you should set up a shared producer table that contains all of the producers that you want to sync:

```ts
// Shared producers file
export type SharedState = CombineStates<typeof sharedProducers>;

export const sharedProducers = {
	foo: fooProducer,
	bar: barProducer,
};
```

```ts
// Client or server producer file
export const producer = combineProducers({
	baz: bazProducer,
	qux: quxProducer,
	...sharedProducers,
});
```

#### 🛰️ Send server dispatches to clients

To automate sending server dispatches to the client, you can use the `createBroadcaster()` function on the server. It takes a map of the producers you want to sync, and `broadcast`, a callback that sends dispatcher calls in bulk to the players who can receive state.

The broadcaster is an object that contains a middleware function that you can apply to your producer, and a `playerRequestedState()` method that you can call when a player fires a remote event to request the initial state.

This example uses the `@rbxts/net` library:

```ts
const broadcaster = createBroadcaster({
	// The producer map that contains all of the producers you want to sync
	producers: sharedProducers,

	// The function that sends the action to players that are listening
	broadcast: (players, actions) => {
		remote.Server.Get("onServerDispatch").SendToPlayers(players, actions);
	},
});

// The remote that the client fires when joining to request the initial state
remote.Server.OnFunction("requestState", (player) => {
	return broadcaster.playerRequestedState(player);
});

// Apply the middleware to send dispatches to the client
producer.applyMiddleware(broadcaster.middleware);
```

#### 📡 Receive server dispatches on the client

You also need to set up the client to receive actions from the server. This is done with the `createBroadcastReceiver()` function, which returns a receiver with a `dispatch()` method and a middleware. The dispatch method runs the actions that were sent by the server.

The `requestState()` function is called when the middleware is applied, and should retrieve the initial state from the server broadcaster. The result gets merged with the current state, so it's safe to use your producer
before the server state is loaded.

```ts
const receiver = createBroadcastReceiver({
	// The function that requests the initial state from the server
	requestState: async () => {
		return remote.Client.Get("requestState").CallServerAsync();
	},
});

// Dispatch the actions that were sent from the server
remote.Client.OnEvent("onServerDispatch", (actions) => {
	receiver.dispatch(actions);
});

// Apply the middleware to request the initial state from the server
producer.applyMiddleware(receiver.middleware);
```

&nbsp;

## 📖 Terminology

-   ♻️ **Producer**: A producer manages state and can dispatch actions or subscribe to state changes.

-   🎂 **State**: An immutable object that represents the current state of the application.

-   🍰 **Selector**: A function that returns a subset of the state.

-   ⚙️ **Action**: A pure function that, given the current state and some parameters, returns a new state.

-   ⚡️ **Dispatcher**: A function that calls an action and updates the state.

&nbsp;

## 📝 License

Reflex is licensed under the [MIT License](LICENSE.md).
