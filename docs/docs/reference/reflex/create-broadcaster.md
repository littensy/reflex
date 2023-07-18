---
sidebar_position: 6
description: Create a broadcaster to sync the server's shared state with clients.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TOCInline from "@theme/TOCInline";

# createBroadcaster

`createBroadcaster` lets you sync the server's shared state with clients, who receive them using [`createBroadcastReceiver`](create-broadcast-receiver).

```ts
const broadcaster = createBroadcaster(options);
```

<TOCInline toc={toc} />

---

## Reference

### `createBroadcaster(options)`

Call `createBroadcaster` to create a broadcaster object that syncs shared state and actions with clients.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createBroadcaster } from "@rbxts/reflex";

const broadcaster = createBroadcaster({
	producers: slices,
	dispatch: (player, actions) => {
		// using @rbxts/remo
		remotes.dispatch.fire(player, actions);
	},
});
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local broadcaster = Reflex.createBroadcaster({
    producers = producers,
    dispatch = function(player, actions)
        -- using Remo
        remotes.dispatch:fire(player, actions)
    end,
})
```

</TabItem>
</Tabs>

After you've created the broadcaster, you will need to **apply the middleware** and **call [`start`](#broadcasterstartplayer)** when a player indicates that it is ready to receive state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
remotes.start.connect((player) => {
	broadcaster.start(player);
});

producer.applyMiddleware(broadcaster.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua
remotes.start:connect(function(player)
    broadcaster:start(player)
end)

producer:applyMiddleware(broadcaster.middleware)
```

</TabItem>
</Tabs>

`createBroadcaster` will automatically filter out server-only state & actions using the `producers` map, and will call the `dispatch` callback when actions are ready to be sent to clients. This allows for a smooth and easy way to share state between the server and clients.

On the client, call [`createBroadcastReceiver`](create-broadcast-receiver) to receive state and actions from the server.

[See more examples below.](#usage)

#### Parameters

-   `options` - An object with options for the broadcaster.
    -   `producers` - A map of shared producers used to filter private actions and state from the root producer.
    -   `dispatch` - A function called when actions are ready to be sent to clients.
    -   `hydrateRate` - The rate at which the entire shared state is sent to clients for hydration. Defaults to `60`.

#### Returns

`createBroadcaster` returns a broadcaster with a [`middleware`](#broadcastermiddleware) function and [`start`](#broadcasterstartplayer) method.

:::info caveats

-   [**Data that is not remote-friendly will be lost.**](#the-client-receives-invalid-state) Because data is sent through remote events, you will lose metatables, functions, and numeric keys.

-   **You need to set up two remotes:** one to send actions to clients, and another to call [`start`](#broadcasterstartplayer) for a client. This can be done with a remote library of your choice.

-   `createBroadcaster` is not supported on the client. See [`createBroadcastReceiver`](create-broadcast-receiver) for receiving broadcasted actions on the client.

:::

---

### `broadcaster.middleware`

Apply the broadcaster [middleware](middleware) to hook up your broadcaster to the root producer.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.applyMiddleware(broadcaster.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua
producer:applyMiddleware(broadcaster.middleware)
```

</TabItem>
</Tabs>

:::info caveats

-   You should only apply the middleware once to your [**root producer**](combine-producers#using-multiple-producers).

-   The middleware should come _before_ any middlewares that transform arguments to ensure the client receives the correct values.

:::

---

### `broadcaster.start(player)`

Marks a player as ready to receive state and actions, and sends the current shared state to the client for hydration.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
remotes.start.connect((player) => {
	broadcaster.start(player);
});
```

</TabItem>
<TabItem value="Luau">

```lua
remotes.start:connect(function(player)
    broadcaster:start(player)
end)
```

</TabItem>
</Tabs>

Players will only be passed to [`options.dispatch`](#createbroadcasteroptions) if they have notified the server with `start`. This is to prevent sending actions to players who are not ready to receive them.

#### Parameters

-   `player` - The player who requested state. Should be received from a remote event call.

#### Returns

`start` does not return anything.

---

## Usage

### Sending server state to clients

Reflex is designed to be used in any environment, on the client and the server. However, in game development, many cases come up where you need to send state from the server to clients.

This is where the concept of **shared producers** comes in. Shared producers are producers that are managed by the server and synced with clients. With [`createBroadcaster`](#createbroadcasteroptions), it's easy to sync these shared producers with clients.

[`createBroadcaster`](#createbroadcasteroptions) receives a map of shared producers. To create shared producers, we'll follow this project structure:

```
shared
├── producers
│   ├── players
│   └── world
└── remotes
```

Your shared `producers` module should look something like this:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="shared/producers/index.ts"
import { CombineStates } from "@rbxts/reflex";
import { playersSlice } from "./players";
import { worldSlice } from "./world";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	players: playersSlice,
	world: worldSlice,
};
```

:::info

Exporting `SharedState` as a type makes it easier to create typed selectors without importing across the client/server boundary.

```ts
import { SharedState } from "shared/slices";

export const selectPlayers = (state: SharedState) => state.players;
```

:::

</TabItem>
<TabItem value="Luau">

```lua title="shared/producers/init.lua"
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local players = require(script.players)
local world = require(script.world)

export type SharedState = players.PlayersState & world.WorldState

export type SharedActions = players.PlayersActions & world.WorldActions

return {
    players = players.playersSlice,
    world = world.worldSlice,
}
```

:::info

Exporting `SharedState` and `SharedActions` helps to build a fully-typed Reflex producer. [See more details on importing and exporting types.](create-producer#importing-and-exporting-types)

:::

</TabItem>
</Tabs>

In this example, we have two shared producers: `players` and `world`. They are put together in a map and returned by `shared/producers` as a map of producers. The contents of these producers are not important - they're just like any other producer - but if you want to see how to write producers, [check out the reference page](create-producer#updating-state-with-actions).

The main benefit of using a _shared producer map_ like this is how simple it is to add them to your root producers:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Root producer"
import { combineProducers } from "@rbxts/reflex";
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

```lua title="Root producer"
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local slices = require(ReplicatedStorage.shared.slices)
local foo = require(script.foo)
local bar = require(script.bar)

export type RootState = slices.SharedState &
    foo.FooState &
    bar.BarState

export type RootActions = slices.SharedActions &
    foo.FooActions &
    bar.BarActions

local map = {
    foo = foo.fooSlice,
    bar = bar.barSlice,
}

for key, value in slices do
    map[key] = value
end

return Reflex.combineProducers(map)
```

:::note

Libraries like [Sift](https://csqrl.github.io/sift/) can make it easier to merge tables.

:::

</TabItem>
</Tabs>

Now that you have your shared producers set up, and include them in both your client and server's root producer, you can now use [`createBroadcaster`](#createbroadcasteroptions) to send state to clients.

You should call [`createBroadcaster`](#createbroadcasteroptions) on the server when your game initializes, either before or after you create your root producer. It receives your shared producer map and a function that sends actions to the clients, and returns a broadcaster object. Make sure you've set up remotes as well:

:::tip prerequisites

You need to define your own remotes to use [`createBroadcaster`](#createbroadcaster). We recommend [RbxNet](http://rbxnet.australis.dev), or [Remo](https://github.com/littensy/remo), which is used in the examples on this page.

You will need two remote events:

-   `dispatch(player: Player, actions: BroadcastAction[])` - This is the remote event that will be fired when the server dispatches actions to clients.

-   `start(player: Player)` - This is the remote event that the clients will fire once they are ready to receive state from the server.

:::

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Server"
import { createBroadcaster } from "@rbxts/reflex";
import { slices } from "shared/slices";
import { remotes } from "shared/remotes";
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

```lua title="Server"
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

This sets up a broadcaster that sends shared actions to the clients when they're dispatched. It also connects a `start` remote, which notifies the server that we are ready to receive actions and state.

[`createBroadcaster`](#createbroadcasteroptions) receives three options:

1.  `producers`: Your _shared producer map_. This is used to determine which state and actions should be sent to the client.
2.  `dispatch`: A user-defined callback that sends shared dispatched actions to the clients. It receives an array of actions and an array of players to send them to.
3.  `hydrateRate`: The rate at which the server should send state to the clients for hydration. This is optional, and defaults to `60`.

It returns a broadcaster object, which has two properties:

1.  `middleware`: A Reflex middleware that helps do some of the heavy lifting for you. You should apply this middleware to your root producer. If you have any middlewares that change dispatched arguments, you should apply them after this middleware to ensure that the arguments are preserved.

2.  `start`: A method that you should call when a client is ready to receive actions and state. This is usually fired when a client applies their own `broadcastReceiver` middleware.

:::caution pitfall

**Make sure your shared state can be sent over a remote!** Objects that use non-string keys or certain values will not be sent over intact. See [Troubleshooting](#troubleshooting) for more information on this common pitfall.

:::

Now that you have your broadcaster set up, you can use [`createBroadcastReceiver`](create-broadcast-receiver) to dispatch actions from the server.

---

### Syncing server state on the client

[To connect a client to a broadcaster, see `createBroadcastReceiver`.](create-broadcast-receiver)

---

## Troubleshooting

### The client receives invalid state

A common oversight when syncing state over remotes is that data that can't be serialized is lost or unexpectedly changed. This is because data is sent through remote events, which only support certain data structures.

Make sure your shared producers are free from:

-   **Metatables:** Instances of classes that have metatables will lose their metatables.
-   **Mixed tables:** Objects must consist entirely of either key-value pairs or numeric indices.
-   **Non-string keys:** Arrays that have blank spaces and objects with non-string keys will be converted to use string keys.

[See Roblox's API reference for an exhaustive list of unsupported data types.](https://create.roblox.com/docs/scripting/argument-limitations-for-bindables-and-remotes)

---

### The client state diverges from the server state

**Your action functions should be _idempotent_.** This means that they should always return the same result when given the same arguments. For example, if you need to generate a random value, it should be passed to the action function as an argument, rather than generated inside the function.

Here's an example of an action that is _not_ idempotent:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(initialState, {
    addItem: (state) => ({
        ...items,
        // error-next-line
        // 🔴 Syncing this action will cause state to diverge
        // error-next-line
        { id: HttpService.GenerateGUID(), name: "New Item" },
    })
})
```

</TabItem>
<TabItem value="Luau">

```lua
local producer = Reflex.createProducer(initialState, {
    addItem = function(state)
        local nextState = table.clone(state)

        // error-next-line
        -- 🔴 Syncing this action will cause state to diverge
        // error-next-line
        table.insert(nextState.items, {
            // error-next-line
            id = HttpService:GenerateGUID(),
            // error-next-line
            name = "New Item"
            // error-next-line
        })

        return nextState
    end,
})
```

</TabItem>
</Tabs>

Actions that are not idempotent will cause the client and server to diverge, as they will generate different results when the client tries to run them with the same arguments.

Instead, you should pass the random value as an argument to the action function:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(initialState, {
    addItem: (state, id: string) => ({
        ...items,
        // highlight-start
        // ✅ This will always output the same result
        { id, name: "New Item" },
        // highlight-end
    })
})
```

</TabItem>
<TabItem value="Luau">

```lua
local producer = Reflex.createProducer(initialState, {
    addItem = function(state, id)
        local nextState = table.clone(state)

        // highlight-start
        -- ✅ This will always output the same result
        table.insert(nextState.items, {
            id = id,
            name = "New Item"
        })
        // highlight-end

        return nextState
    end,
})
```

</TabItem>
</Tabs>
