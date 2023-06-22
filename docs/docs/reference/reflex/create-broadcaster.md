---
sidebar_position: 6
description: Create a broadcaster to sync the server's shared state with clients.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# createBroadcaster

`createBroadcaster` lets you sync the server's shared state with clients, who receive them using [`createBroadcastReceiver`](create-broadcast-receiver).

```ts
const broadcaster = createBroadcaster({ producer, options });
```

<TOCInline toc={toc} />

---

## Reference

### `createBroadcaster(options)`

Call `createBroadcaster` to create a broadcaster object that syncs shared state and actions with clients.

<Tabs>
<TabItem value="TypeScript" default>

```ts
import { createBroadcaster } from "@rbxts/reflex";

const broadcaster = createBroadcaster({
	producers: sharedProducers,
	broadcast: (players, actions) => {
		// using @rbxts/net
		remotes.Server.Get("broadcast").SendToPlayers(players, actions);
	},
});
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.reflex)

local broadcaster = Reflex.createBroadcaster({
    producers = producers,
    broadcast = function(players, actions)
        -- using RbxNet
        remotes.Server:Get("broadcast"):SendToPlayers(players, actions)
    end,
})
```

</TabItem>
</Tabs>

After you've created the broadcaster, you will need to **apply the middleware** and **call [`playerRequestedState`](#broadcasterplayerrequestedstateplayer)** when a player requests state from the server:

<Tabs>
<TabItem value="TypeScript" default>

```ts
remotes.Server.OnFunction("requestState", (player) => {
	return broadcaster.playerRequestedState(player);
});

producer.applyMiddleware(broadcaster.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua
remotes.Server:OnFunction("requestState", function(player)
    return broadcaster:playerRequestedState(player)
end)

producer:applyMiddleware(broadcaster.middleware)
```

</TabItem>
</Tabs>

`createBroadcaster` will automatically filter out server-only state & actions using the `producers` map, and will call the `broadcast` callback when actions are ready to be sent to clients. This allows for a smooth and easy way to share state between the server and clients.

On the client, call [`createBroadcastReceiver`](create-broadcast-receiver) to receive state and actions from the server.

[See more examples below.](#usage)

#### Parameters

-   `options` - An object with options for the broadcaster.
    -   `producers` - A map of shared producers used to filter private actions and state from the root producer.
    -   `broadcast` - A function called when actions are ready to be sent to clients.

#### Returns

`createBroadcaster` returns a broadcaster with a [`middleware`](#broadcastermiddleware) function and [`playerRequestedState`](#broadcasterplayerrequestedstateplayer) method.

:::info caveats

-   [**Data that is not remote-friendly will be lost.**](#the-client-receives-invalid-state) Because data is sent through remote events, you will lose metatables, functions, and numeric keys.

-   **You need to set up two remotes:** one to send actions to clients, and another to invoke [`playerRequestedState`](#broadcasterplayerrequestedstateplayer) for a client. This can be done with a remote library of your choice.

-   `createBroadcaster` is not supported on the client. See [`createBroadcastReceiver`](create-broadcast-receiver) for receiving broadcasted actions on the client.

:::

---

### `broadcaster.middleware`

Apply the broadcaster [middleware](middleware) to hook up your broadcaster to the root producer.

<Tabs>
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

### `broadcaster.playerRequestedState(player)`

Process a player's request for state with `playerRequestedState`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
remotes.Server.OnFunction("requestState", (player) => {
	return broadcaster.playerRequestedState(player);
});
```

</TabItem>
<TabItem value="Luau">

```lua
remotes.Server:OnFunction("requestState", function(player)
    return broadcaster:playerRequestedState(player)
end)
```

</TabItem>
</Tabs>

Players will only be added to the `players` argument of [`options.broadcast`](#createbroadcasteroptions) if they have requested state through `playerRequestedState`. This is to prevent sending actions to players who are not ready to receive them.

#### Parameters

-   `player` - The player who requested state. Should be received from a remote function call.

#### Returns

`playerRequestedState` returns the state of the root producer. Non-shared state is automatically filtered out.

:::info caveats

-   `playerRequestedState` throws an error if a player requests state more than once before leaving the game.

:::

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

<Tabs>
<TabItem value="TypeScript" default>

```ts title="shared/producers/index.ts"
import { CombineStates } from "@rbxts/reflex";
import { playersProducer } from "./players";
import { worldProducer } from "./world";

export type SharedState = CombineStates<typeof sharedProducers>;

export const sharedProducers = {
	players: playersProducer,
	world: worldProducer,
};
```

:::info

Exporting `SharedState` as a type makes it easier to create typed selectors without importing across the client/server boundary.

```ts
import { SharedState } from "shared/producers";

export const selectPlayers = (state: SharedState) => state.players;
```

:::

</TabItem>
<TabItem value="Luau">

```lua title="shared/producers/init.lua"
local Reflex = require(ReplicatedStorage.Packages.reflex)
local players = require(script.players)
local world = require(script.world)

export type SharedState = players.PlayersState & world.WorldState

export type SharedDispatchers = players.PlayersDispatchers & world.WorldDispatchers

return {
    players = players.producer,
    world = world.producer,
}
```

:::info

Exporting `SharedState` and `SharedDispatchers` helps to build a fully-typed Reflex producer. [See more details on importing and exporting types.](create-producer#importing-and-exporting-types)

:::

</TabItem>
</Tabs>

In this example, we have two shared producers: `players` and `world`. They are put together in a map and returned by `shared/producers` as a map of producers. The contents of these producers are not important - they're just like any other producer - but if you want to see how to write producers, [check out the reference page](create-producer#updating-state-with-actions).

The main benefit of using a _shared producer map_ like this is how simple it is to add them to your root producers:

<Tabs>
<TabItem value="TypeScript" default>

```ts title="Root producer"
import { combineProducers } from "@rbxts/reflex";
import { sharedProducers } from "shared/producers";
import { fooProducer } from "./foo";
import { barProducer } from "./bar";

export type RootState = InferState<typeof producers>;

export const producer = combineProducers({
	...sharedProducers,
	foo: fooProducer,
	bar: barProducer,
});
```

</TabItem>
<TabItem value="Luau">

```lua title="Root producer"
local Reflex = require(ReplicatedStorage.Packages.reflex)
local producers = require(ReplicatedStorage.shared.producers)
local foo = require(script.foo)
local bar = require(script.bar)

export type RootState = producers.SharedState &
    foo.FooState &
    bar.BarState

export type RootDispatchers = producers.SharedDispatchers &
    foo.FooDispatchers &
    bar.BarDispatchers

local map = {
    foo = foo.producer,
    bar = bar.producer,
}

for key, value in producers do
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

You need a networking solution to use [`createBroadcaster`](#createbroadcasteroptions). We recommend [RbxNet](http://rbxnet.australis.dev), which is used in the examples on this page. You need to specify two remotes:

-   A server event that sends actions to a clients. The type of this event would be `(actions: BroadcastAction[]) => void`.
-   A server function that returns the state of the root producer. The type of this function would be `(player: Player) => SharedState`.

:::

<Tabs>
<TabItem value="TypeScript" default>

```ts title="Server"
import { createBroadcaster } from "@rbxts/reflex";
import { sharedProducers } from "shared/producers";
import { remotes } from "shared/remotes";
import { producer } from "./producer";

const broadcaster = createBroadcaster({
	producers: sharedProducers,
	broadcast: (players, actions) => {
		remotes.Server.Get("broadcast").SendToPlayers(players, actions);
	},
});

remotes.Server.OnFunction("requestState", (player) => {
	return broadcaster.playerRequestedState(player);
});

producer.applyMiddleware(broadcaster.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua title="Server"
local Reflex = require(ReplicatedStorage.Packages.reflex)
local producers = require(ReplicatedStorage.shared.producers)
local remotes = require(ReplicatedStorage.shared.remotes)
local producer = require(script.Parent.producer)

local broadcaster = Reflex.createBroadcaster({
    producers = producers,
    broadcast = function(players, actions)
        remotes.Server:Get("broadcast"):SendToPlayers(players, actions)
    end,
})

remotes.Server:OnFunction("requestState", function(player)
    return broadcaster:playerRequestedState(player)
end)

producer:applyMiddleware(broadcaster.middleware)
```

</TabItem>
</Tabs>

This sets up a broadcaster that sends shared actions to the clients when they're dispatched. It also connects a `requestState` remote that returns the state with `playerRequestedState`, which automatically filters out any state that the client doesn't have access to.

[`createBroadcaster`](#createbroadcasteroptions) receives two options:

1.  `producers`: Your _shared producer map_. This is used to determine which state and actions should be sent to the client.
2.  `broadcast`: A user-defined callback that sends shared dispatched actions to the clients. It receives an array of actions and an array of players to send them to.

It returns a broadcaster object, which has two properties:

1.  `middleware`: A Reflex middleware that helps do some of the heavy lifting for you. You should apply this middleware to your root producer. If you have any middlewares that change dispatched arguments, you should apply them after this middleware to ensure that the arguments are preserved.

2.  `playerRequestedState`: A method that receives the player that requested state, and returns the shared part of the root producer's state. It should only be called within a remote.

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
