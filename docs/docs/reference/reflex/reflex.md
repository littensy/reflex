---
description: API Reference for Reflex, a state management library for Roblox.
---

# Reflex

_Reflex_ allow you to efficiently track and manage the state of your game. This page documents the core Reflex APIs.

Reflex provides these top-level exports:

-   [`createProducer(initialState, actions)`](create-producer)
-   [`combineProducers(producers)`](combine-producers)
-   [`createSelector(dependencies, combiner)`](create-selector)
-   [`createBroadcaster(options)`](create-broadcaster)
-   [`createBroadcastReceiver(options)`](create-broadcast-receiver)
-   [`loggerMiddleware`](middleware#loggermiddleware)

---

## Producers

_Producers_ are the state containers that control the state of your game. They are the core of Reflex and are used to listen to state changes and dispatch actions.

Explore how to use producers to manage your game:

-   [`createProducer`](create-producer) creates a producer with an initial state and a set of actions.
    -   [Updating state with actions](create-producer#updating-state-with-actions)
    -   [Updating nested state](create-producer#updating-nested-state)
    -   [Importing and exporting types](create-producer#importing-and-exporting-types)
-   [Producers](producer) contain your state, actions, and everything you need to manage them.
    -   [Running side effects](producer#running-side-effects)
    -   [Waiting for state changes](producer#waiting-for-state-changes)
    -   [Transforming state with selectors](producer#transforming-state-with-selectors)
    -   [Using the observer pattern](producer#using-the-observer-pattern)
-   [`combineProducers`](combine-producers) lets you compose a new producer of multiple sub-producers.
    -   [Using multiple producers](combine-producers#using-multiple-producers)
    -   [Selecting combined state](combine-producers#selecting-combined-state)
    -   [Dispatching one action to multiple producers](combine-producers#dispatching-one-action-to-multiple-producers)

```ts
const producer = createProducer(0, {
	increment: (state, value: number) => state + value,
	decrement: (state, value: number) => state - value,
	set: (_, value: number) => value,
});
```

---

## Selectors

If your state is a complex object, you can use _selectors_ to extract specific parts of it. Selectors are functions that take your state and return a subset of it. Reflex offers a built-in function to write efficient selectors:

-   [`createSelector`](create-selector) optimizes selectors to only run when state changes.
    -   [Transforming state](create-selector#transforming-state)
    -   [Passing input parameters](create-selector#passing-input-parameters)

```ts
const selectItems = (state: State) => state.items;

const selectInStock = createSelector([selectItems], (items) => {
	return items.filter((item) => item.stock > 0);
});
```

---

## Middleware

_Middleware_ lets you enhance actions and producers with additional functionality. You can use middleware to add logging, patch methods, cancel actions, and more.

Reflex provides some commonly used middleware:

-   [`loggerMiddleware`](middleware#loggermiddleware) logs all actions and state changes.

You can also [define your own middleware](middleware#your-first-middleware):

-   [Your first middleware](middleware#your-first-middleware)
-   [Cancelling actions](middleware#cancelling-actions)

```ts
producer.applyMiddleware(loggerMiddleware, customMiddleware);
```

---

## Server-to-client sync

Reflex offers a built-in solution to sync state between the server and the client with _broadcasters_ and _receivers_. They assist the server with separating private and shared state, and they help the client with syncing state with the server.

-   [`createBroadcaster`](create-broadcaster) creates a broadcaster that shares server state with clients.
-   [`createBroadcastReceiver`](create-broadcast-receiver) creates a receiver that syncs client state with the server.

Explore how to use broadcasters and receivers to sync state:

-   [Sending server state to clients](create-broadcaster#sending-server-state-to-clients)
-   [Syncing server state on the client](create-broadcast-receiver#syncing-server-state-on-the-client)

```ts title="Server snippet"
const broadcaster = createBroadcaster({
	producers: sharedProducers,
	broadcast: (players, actions) => {
		remotes.Server.Get("broadcast").SendToPlayers(players, actions);
	},
});
```

```ts title="Client snippet"
const receiver = createBroadcastReceiver({
	requestState: async () => {
		const remote = await remotes.Client.WaitFor("requestState");
		return remote.CallServerAsync();
	},
});
```
