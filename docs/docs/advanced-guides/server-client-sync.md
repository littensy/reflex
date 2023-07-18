---
description: Learn how to use broadcasters to sync state between the server and clients.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Server-Client Sync

Reflex provides a quick way to sync the server's shared state with clients using **broadcasters** and **receivers**.

:::note what you'll learn

-   🌎 What shared producer slices are
-   🔗 How to integrate shared slices into your state
-   🛰️ How to create broadcasters
-   📡 How to create receivers

:::

---

## Sync server state with clients

Reflex is designed to be used in any environment, on the client and the server. However, in game development, many cases come up where you need to send state from the server to clients. This is where the concept of **shared slices** comes in.

### Sharing state

Shared slices are producers that are managed by the server and synced with clients. To create shared slices, we'll follow this project structure:

```
shared
├── slices
│   ├── calendar
│   └── todos
└── remotes
```

Your shared `slices` module should look something like this:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="shared/slices/index.ts" showLineNumbers
import { CombineStates } from "@rbxts/reflex";
import { calendarSlice } from "./calendar";
import { todosSlice } from "./todos";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	calendar: calendarSlice,
	todos: todosSlice,
};
```

:::tip

Exporting `SharedState` as a type makes it easier to create typed selectors without importing across the client/server boundary.

```ts
import { SharedState } from "shared/slices";

export const selectPlayers = (state: SharedState) => state.players;
```

:::

</TabItem>
<TabItem value="Luau">

```lua title="shared/slices/init.lua" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local calendar = require(script.calendar)
local todos = require(script.todos)

export type SharedState = {
    calendar: calendar.CalendarState,
    todos: todos.TodosState,
}

export type SharedActions = calendar.CalendarActions & todos.TodosActions

return {
    calendar = calendar.calendarSlice,
    todos = todos.todosSlice,
}
```

:::tip

Exporting `SharedState` and `SharedActions` helps to build a fully-typed root producer.

:::

</TabItem>
</Tabs>

In this example, we have two shared producer slices: `calendar` and `todos`. They are put together in a map and returned by `shared/slices`. The contents of these files are not important - they're just like any other producer - but if you want to see how to write producers, [check out this guide](../guides/your-first-producer)

Using a map of shared slices makes it easy to add them to your root producer. In your root producer file, you can import the shared slices and spread them into your root producer:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Root producer" showLineNumbers
import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/slices";
import { fooSlice } from "./foo";
import { barSlice } from "./bar";

export type RootState = InferState<typeof producers>;

export const producer = combineProducers({
	...slices,
	foo: fooSlice,
	bar: barSlice,
});
```

</TabItem>
<TabItem value="Luau">

```lua title="Root producer" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local slices = require(ReplicatedStorage.shared.slices)
local foo = require(script.foo)
local bar = require(script.bar)

export type RootProducer = Reflex.Producer<RootState, RootActions>

export type RootState = slices.SharedState &
    foo.FooState &
    bar.BarState

export type RootActions = slices.SharedActions &
    foo.FooActions &
    bar.BarActions

local rootSlices = {
    foo = foo.fooSlice,
    bar = bar.barSlice,
}

for name, slice in slices do
    rootSlices[name] = slice
end

return Reflex.combineProducers(rootSlices) :: RootProducer
```

:::note

Libraries like [Sift](https://csqrl.github.io/sift/) can make it easier to merge tables in Luau.

:::

</TabItem>
</Tabs>

Now that you have your shared state set up, and include them in both your client and server's root producer, you can now use [`createBroadcaster`](../reference/reflex/create-broadcaster#createbroadcasteroptions) to send state to clients.

### Creating a broadcaster

You should call [`createBroadcaster`](../reference/reflex/create-broadcaster#createbroadcasteroptions) on the server when your game initializes, either before or after you create your root producer. It receives your shared producer map and a function that sends actions to the clients, and returns a broadcaster object. Make sure you've set up remotes as well:

:::tip prerequisites

You need to define your own remotes to use [`createBroadcaster`](../reference/reflex/create-broadcaster). We recommend [RbxNet](http://rbxnet.australis.dev), or [Remo](https://github.com/littensy/remo), which is used in the examples on this page.

You will need two remote events:

-   `dispatch(player: Player, actions: BroadcastAction[])` - This is the remote event that will be fired when the server dispatches actions to clients.

-   `start(player: Player)` - This is the remote event that the clients will fire once they are ready to receive state from the server.

:::

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Server" showLineNumbers
import { createBroadcaster } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { slices } from "shared/slices";
import { producer } from "./producer";

const broadcaster = createBroadcaster({
	producers: slices,
	dispatch: (player, actions) => {
		remotes.dispatch.fire(player, actions);
	},
});

remotes.start.connect((player) => {
	broadcaster.start(player);
});

producer.applyMiddleware(broadcaster.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua title="Server" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local remotes = require(ReplicatedStorage.shared.remotes)
local slices = require(ReplicatedStorage.shared.slices)
local producer = require(script.Parent.producer)

local broadcaster = Reflex.createBroadcaster({
    producers = slices,
    dispatch = function(player, actions)
        remotes.dispatch:fire(player, actions)
    end,
})

remotes.start:connect(function(player)
    broadcaster:start(player)
end)

producer:applyMiddleware(broadcaster.middleware)
```

</TabItem>
</Tabs>

This sets up a broadcaster that sends shared actions to the clients when they're dispatched. Once the middleware is applied, Reflex will begin syncing dispatched actions to the clients.

[`createBroadcaster`](../reference/reflex/create-broadcaster) receives three options:

1.  `producers`: Your _shared slices_. This is used to determine which state and actions should be sent to the client.

2.  `dispatch`: A user-defined callback that sends shared dispatched actions to the clients. It receives an array of actions and a player to send them to.

3.  `hydrateRate`: The rate in seconds at which the server should send the latest state to the clients. The default is `60`, which means that every minute, every client passed to `start` will re-hydrate their store with the latest state.

It returns a broadcaster object, which has two properties:

1.  `middleware`: A Reflex middleware that helps do some of the heavy lifting for you. You should apply this middleware to your root producer. If you have any middlewares that change dispatched arguments, you should apply them after this middleware to ensure that the arguments are preserved.

2.  `start`: A method that marks the player as ready to begin receiving shared state and actions. This should be called by the client in a `broadcastReceiver`.

:::caution pitfall

**Make sure your shared state can be sent over a remote!** Objects that use non-string keys or certain values will not be sent over intact. See the [troubleshooting](../reference/reflex/create-broadcaster#troubleshooting) page for more information on this common pitfall.

:::

### Creating a receiver

Once you have your broadcaster set up, you can use [`createBroadcastReceiver`](../reference/reflex/create-broadcast-receiver#createbroadcastreceiveroptions) to initialize the client state with the server's shared state and keep it in sync.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Client" showLineNumbers
import { createBroadcastReceiver } from "@rbxts/reflex";

const receiver = createBroadcastReceiver({
	start: () => {
		remotes.start.fire();
	},
});

remotes.dispatch.connect((actions) => {
	receiver.dispatch(actions);
});

producer.applyMiddleware(receiver.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua title="Client" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local receiver = Reflex.createBroadcastReceiver({
    start = function()
        remotes.start.fire()
    end,
})

remotes.dispatch:connect(function(actions)
    receiver:dispatch(actions)
end)

producer:applyMiddleware(receiver.middleware)
```

</TabItem>
</Tabs>

This code will call `start` when the middleware is applied, and hydrate the client's state with the server's shared state. Calling `dispatch` will send the actions from the broadcaster to the client's store and enable automatic hydration.

**It's thread-safe,** so it's safe to apply the middleware at any time, and you can even use your producer before the server's state is received.

---

## Summary

-   Shared state is synced between the server and client using a broadcaster and a receiver.
-   The **broadcaster** is responsible for sending state and actions to the receiver.
-   The **receiver** is responsible for dispatching actions from the broadcaster.
