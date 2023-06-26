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

export type SharedState = CombineStates<typeof sharedSlices>;

export const sharedSlices = {
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
import { sharedSlices } from "shared/slices";
import { fooSlice } from "./foo";
import { barSlice } from "./bar";

export type RootState = InferState<typeof producers>;

export const producer = combineProducers({
	...sharedSlices,
	foo: fooSlice,
	bar: barSlice,
});
```

</TabItem>
<TabItem value="Luau">

```lua title="Root producer" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local sharedSlices = require(ReplicatedStorage.shared.slices)
local foo = require(script.foo)
local bar = require(script.bar)

export type RootProducer = Reflex.Producer<RootState, RootActions>

export type RootState = producers.SharedState &
    foo.FooState &
    bar.BarState

export type RootActions = producers.SharedActions &
    foo.FooActions &
    bar.BarActions

local slices = {
    foo = foo.fooSlice,
    bar = bar.barSlice,
}

for name, slice in sharedSlices do
    slices[name] = slice
end

return Reflex.combineProducers(slices) :: RootProducer
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

You need remotes to use [`createBroadcaster`](../reference/reflex/create-broadcaster). We recommend [RbxNet](http://rbxnet.australis.dev), which is used in the examples on this page. You need to specify two remotes:

-   A server event that sends actions to a clients. The type of this event would be `(actions: BroadcastAction[]) => void`.
-   A server function that returns the state of the root producer. The type of this function would be `(player: Player) => SharedState`.

:::

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Server" showLineNumbers
import { createBroadcaster } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { sharedSlices } from "shared/slices";
import { producer } from "./producer";

const broadcast = remotes.Server.Get("broadcast");
const requestState = remotes.Server.Get("requestState");

const broadcaster = createBroadcaster({
	producers: sharedSlices,
	broadcast: (players, actions) => {
		broadcast.SendToPlayers(players, actions);
	},
});

requestState.SetCallback((player) => {
	return broadcaster.playerRequestedState(player);
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

local broadcast = remotes.Server:Get("broadcast")
local requestState = remotes.Server:Get("requestState")

local broadcaster = Reflex.createBroadcaster({
    producers = slices,
    broadcast = function(players, actions)
        broadcast:SendToPlayers(players, actions)
    end,
})

requestState:SetCallback(function(player)
    return broadcaster:playerRequestedState(player)
end)

producer:applyMiddleware(broadcaster.middleware)
```

</TabItem>
</Tabs>

This sets up a broadcaster that sends shared actions to the clients when they're dispatched. It also connects a `requestState` remote that returns the state with `playerRequestedState`, which automatically filters out any state that the client doesn't have access to.

[`createBroadcaster`](../reference/reflex/create-broadcaster) receives two options:

1.  `producers`: Your _shared slices_. This is used to determine which state and actions should be sent to the client.
2.  `broadcast`: A user-defined callback that sends shared dispatched actions to the clients. It receives an array of actions and an array of players to send them to.

It returns a broadcaster object, which has two properties:

1.  `middleware`: A Reflex middleware that helps do some of the heavy lifting for you. You should apply this middleware to your root producer. If you have any middlewares that change dispatched arguments, you should apply them after this middleware to ensure that the arguments are preserved.

2.  `playerRequestedState`: A method that receives the player that requested state, and returns the shared part of the root producer's state. It should only be called within a remote.

:::caution pitfall

**Make sure your shared state can be sent over a remote!** Objects that use non-string keys or certain values will not be sent over intact. See the [troubleshooting](../reference/reflex/create-broadcaster#troubleshooting) page for more information on this common pitfall.

:::

### Creating a receiver

Once you have your broadcaster set up, you can use [`createBroadcastReceiver`](../reference/reflex/create-broadcast-receiver#createbroadcastreceiveroptions) to initialize the client state with the server's shared state and keep it in sync.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Client" showLineNumbers
import { createBroadcastReceiver } from "@rbxts/reflex";

const broadcast = remotes.Client.Get("broadcast");
const requestState = remotes.Client.Get("requestState");

const receiver = createBroadcastReceiver({
	requestState: async () => {
		return requestState.CallServerAsync();
	},
});

broadcast.Connect((actions) => {
	receiver.dispatch(actions);
});

producer.applyMiddleware(receiver.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua title="Client" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local broadcast = remotes.Server:Get("broadcast")
local requestState = remotes.Server:Get("requestState")

local receiver = Reflex.createBroadcastReceiver({
    requestState = function()
        return requestState:CallServerAsync()
    end,
})

broadcast:Connect(function(actions)
    receiver:dispatch(actions)
end)

producer:applyMiddleware(receiver.middleware)
```

</TabItem>
</Tabs>

This code will call `requestState` when the middleware is applied, and merge the server's shared state with the client's state. You should also connect the receiver's `dispatch` method to the remote, so that the state continues to be kept in sync.

**It's thread-safe,** as you can set up `createBroadcastReceiver` in a script separate from your producer and it will work as long as you apply the middleware to the producer and connect the receiver's `dispatch` method to the remote.

It's safe to apply the middleware at any time, and you can even use your producer before the server's state is received.

---

## Recipes

### Filtering state before sending it to a client

In your broadcaster, you have control over what the client receives when they request state. You can write a function that filters out any state that the client doesn't have access to.

Here, let's filter a `playerData` slice to only include the data of the player that requested state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Server"
function filterPlayerData(player: Player, state: SharedState) {
	return {
		...state,
		playerData: {
			[player.Name]: state.playerData[player.Name],
		},
	};
}

// ...

requestState.SetCallback((player) => {
	const state = broadcaster.playerRequestedState(player);
	return filterPlayerData(player, state);
});
```

</TabItem>
<TabItem value="Luau">

```lua title="Server"
local function filterPlayerData(player, state)
    local filteredState = table.clone(state)
    filteredState.playerData = {
        [player.Name] = state.playerData[player.Name],
    }
    return filteredState
end

-- ...

requestState:SetCallback(function(player)
    local state = broadcaster:playerRequestedState(player)
    return filterPlayerData(player, state)
end)
```

</TabItem>
</Tabs>

### Filtering actions before sending them to a player

You can also filter actions before sending them to a player, which is useful for things like private player data. This is done by modifying the `actions` array in the `broadcast` callback.

We'll write a function that only broadcasts player data actions if the first `name` argument of an action is the same as the player that is receiving the action:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Action filter"
function findPlayerName(args: unknown[]) {
	// Search for a valid username in the arguments
	for (const value of args) {
		if (typeIs(value, "string") && Players.FindFirstChild(value)) {
			return value;
		}
	}
}

function createPlayerNameFilter(...actions: { readonly [name: string]: Callback }[]) {
	const names = new Set<string>();

	// Create a set of all the action names that we want to filter
	for (const actionMap of actions) {
		for (const name of Object.keys(actionMap)) {
			names.add(name);
		}
	}

	return (player: Player, actions: BroadcastAction[]) => {
		// Filter out actions if they are a player data action and this
		// player isn't the target
		return actions.filter((action) => {
			// If the action name isn't in the set, keep it
			if (!names.has(action.name)) {
				return true;
			}

			// Search for a valid username in the arguments
			const name = findPlayerName(action.arguments);

			// If the action doesn't have a valid username, keep it
			// Otherwise, only keep the action if the username matches
			return name === undefined || name === player.Name;
		});
	};
}

const playerDataFilter = createPlayerNameFilter(playerDataSlice.getActions());
```

```ts title="Server"
const broadcast = remotes.Server.Get("broadcast");

const broadcaster = createBroadcaster({
	producers: sharedSlices,
	broadcast: (players, actions) => {
		for (const player of players) {
			// highlight-next-line
			const filteredActions = playerDataFilter(player, actions);
			broadcast.SendToPlayer(player, filteredActions);
		}
	},
});
```

</TabItem>
<TabItem value="Luau">

```lua title="Action filter"
local function findPlayerName(args: { any })
    -- Search for a valid username in the arguments
    for _, value in args do
        if type(value) == "string" and Players:FindFirstChild(value) then
            return value
        end
    end
end

local function createPlayerNameFilter(...: { [string]: (...any) -> any })
    local names: { [string]: boolean } = {}

    -- Create a set of all the action names that we want to filter
    for _, actionMap in { ... } do
        for name in actionMap do
            names[name] = true
        end
    end

    return function(player, actions)
        local filteredActions = {}

        -- Filter out actions if they are a player data action and this
        -- player isn't the target
        for _, action in actions do
            -- If the action name isn't in the set, keep it
            if not names[action.name] then
                table.insert(filteredActions, action)
                continue
            end

            -- Search for a valid username in the arguments
            local name = findPlayerName(action.arguments)

            -- If the action doesn't have a valid username, keep it
            -- Otherwise, only keep the action if the username matches
            if name == nil or name == player.Name then
                table.insert(filteredActions, action)
            end
        end

        return filteredActions
    end
end

local playerDataFilter = createPlayerNameFilter(playerDataSlice:getActions())

```

```lua title="Server"
local broadcast = remotes.Server:Get("broadcast")

local broadcaster = Reflex.createBroadcaster({
    producers = sharedSlices,
    broadcast = function(players, actions)
        for _, player in players do
            local filteredActions = playerDataFilter(player, actions)
            broadcast:SendToPlayer(player, filteredActions)
        end
    end,
})
```

</TabItem>
</Tabs>

:::tip

You can rewrite the `findPlayerName` function to be more specific to your use case. For example, if you want to filter by user ID instead of username, you can use `Players.GetPlayerByUserId` instead of `Players.FindFirstChild`.

:::

---

## Summary

-   Shared state is synced between the server and client using a broadcaster and a receiver.
-   The **broadcaster** is responsible for sending state and actions to the receiver.
-   The **receiver** is responsible for dispatching actions from the broadcaster.
