---
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# combineProducers

`combineProducers` lets you combine multiple [producers](producer) into a single producer.

```ts
const producer = combineProducers({
	foo: fooProducer,
	bar: barProducer,
	// ...
});
```

<TOCInline toc={toc} />

---

## Reference

### `combineProducers(producers)`

To combine multiple [producers](producer), pass them into `combineProducers` as a map of names to producers.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const fooProducer = createProducer(0, {
	incrementFoo: (state, value: number) => state + value,
});

const barProducer = createProducer(0, {
	incrementBar: (state, value: number) => state + value,
});

const producer = combineProducers({
	foo: fooProducer,
	bar: barProducer,
});
```

</TabItem>
<TabItem value="Luau">

```lua
local fooProducer = createProducer(0, {
    incrementFoo = function(state, value: number)
        return state + value
    end,
})

local barProducer = createProducer(0, {
    incrementBar = function(state, value: number)
        return state + value
    end,
})

local producer = Redux.combineProducers({
    foo = fooProducer,
    bar = barProducer,
})
```

</TabItem>
</Tabs>

`combineProducers` will return a new [producer](producer) with state organized under the keys passed in `producers`. Actions are inherited from the original producers and will update the state of their corresponding sub-states.

```ts
producer.incrementFoo(1); // { foo: 1, bar: 0 }
producer.incrementBar(1); // { foo: 1, bar: 1 }
```

A game managed by Reflex will typically have a single root producer that contains all of the game's state. State can be organized into sub-producers to make it easier to manage and update.

[See more examples below.](#usage)

#### Parameters

-   `producers` - An object containing the [producers](producer) to combine. The combined producer's state will organize the state by the keys of this object. Actions will be inherited from the original producers.

#### Returns

A new [producer](producer) with the combined initial states and actions of the given producers.

:::info Caveats

-   The producer returned by `combineProducers` is decoupled from the original producers. Updating the state of the combined producer will not update the state of the original producers.

-   Actions can be stacked. If two actions with the same name are dispatched, they will both be called and update their respective sub-states. This can be useful for [batching updates](#dispatching-one-action-to-multiple-producers), but make sure the functions have identical signatures.

:::

---

## Usage

### Using multiple producers

It's good practice to organize state into different producers and then combine them with [`combineProducers`](combine-producers) to use in your game. This makes it easier to manage state and update it in a predictable way.

Let's say we have a game that has a page router and a leaderboard. We can create a file for each sub-producer, and combine them into a single root producer:

```
producer
├── router
└── leaderboard
```

<Tabs>
<TabItem value="TypeScript" default>

:::info

In TypeScript, you should use `InferState` or an equivalent type to export the root state from the root producer file. This is for easy access to state for certain features like [selectors](producer#running-side-effects) and Hooks.

:::

<Tabs>
<TabItem value="router.ts">

```ts
import { createProducer } from "@rbxts/reflex";

export interface RouterState {
	readonly page: string;
}

const initialState: RouterState = {
	page: "home",
};

export const routerProducer = createProducer(initialState, {
	setPage: (state, page: string) => ({ ...state, page }),
});
```

</TabItem>
<TabItem value="leaderboard.ts">

```ts
import { createProducer } from "@rbxts/reflex";

export interface LeaderboardState {
	readonly players: readonly number[];
}

const initialState: LeaderboardState = {
	players: [],
};

export const leaderboardProducer = createProducer(initialState, {
	addPlayer: (state, player: number) => ({
		...state,
		players: [...state.players, player],
	}),

	removePlayer: (state, player: number) => ({
		...state,
		players: state.players.filter((p) => p !== player),
	}),
});
```

</TabItem>
<TabItem value="index.ts">

```ts
import { combineProducers, InferState } from "@rbxts/reflex";
import { routerProducer } from "./router";
import { leaderboardProducer } from "./leaderboard";

export type RootProducer = typeof producer;

export type RootState = InferState<RootProducer>;

export const producer = combineProducers({
	router: routerProducer,
	leaderboard: leaderboardProducer,
});
```

</TabItem>
<TabItem value="Usage">

```ts
import { producer } from "./producer";

producer.setPage("leaderboard");
// --> { router: { page: "leaderboard" }, ... }

producer.addPlayer(123);
// --> { leaderboard: { players: [123] }, ... }
```

</TabItem>
</Tabs>
</TabItem>
<TabItem value="Luau">

:::info

In Luau, you should exporting the types from each producer file and manually combine them in the root producer file. This allows you to have a type-safe root producer with intellisense for state and actions.

:::

<Tabs>
<TabItem value="router.lua">

```lua
local Reflex = require(ReplicatedStorage.Packages.reflex)

export type RouterState = {
    page: string,
}

export type RouterDispatchers = {
    setPage: (page: string) -> RouterState,
}

local initialState: RouterState = {
    page = "home",
}

local routerProducer = Reflex.createProducer(initialState, {
    setPage = function(state, page: string)
        return { page = page }
    end,
})

return {
    producer = routerProducer,
}
```

</TabItem>
<TabItem value="leaderboard.lua">

```lua
local Reflex = require(ReplicatedStorage.Packages.reflex)

export type LeaderboardState = {
    players: { number },
}

export type LeaderboardDispatchers = {
    addPlayer: (player: number) -> LeaderboardState,
    removePlayer: (player: number) -> LeaderboardState,
}

local initialState: LeaderboardState = {
    players = {},
}

local leaderboardProducer = Reflex.createProducer(initialState, {
    addPlayer = function(state, player: number)
        local nextState = table.clone(state)
        local nextPlayers = table.clone(state.players)

        table.insert(nextPlayers, player)
        nextState.players = nextPlayers

        return nextState
    end,

    removePlayer = function(state, player: number)
        local nextState = table.clone(state)
        local nextPlayers = table.clone(state.players)

        table.remove(nextPlayers, table.find(nextPlayers, player) or -1)
        nextState.players = nextPlayers

        return nextState
    end,
})

return {
    producer = leaderboardProducer,
}
```

</TabItem>
<TabItem value="init.lua">

```lua
local Reflex = require(ReplicatedStorage.Packages.reflex)
local router = require(script.router)
local leaderboard = require(script.leaderboard)

export type RootProducer = Reflex.Producer<RootState, RootDispatchers>

export type RootState = {
    router: router.RouterState,
    leaderboard: leaderboard.LeaderboardState,
}

export type RootDispatchers = router.RouterDispatchers &
    leaderboard.LeaderboardDispatchers

return Reflex.combineProducers({
    router = router.producer,
    leaderboard = leaderboard.producer,
}) :: RootProducer
```

</TabItem>
<TabItem value="Usage">

```lua
local Reflex = require(ReplicatedStorage.Packages.reflex)
local producer = require(script.Parent.producer)

producer.setPage("leaderboard")
--> { router = { page = "leaderboard" }, ... }

producer.addPlayer(123)
--> { leaderboard = { players = { 123 } }, ... }
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

Remember that the combined producer is decoupled from the original producers. Updating the state of the combined producer will not update the state of the original producers, and vice versa.

---

### Selecting combined state

[`combineProducers`](combine-producers) will organize state by the keys of the given `producers` object. This makes it easy to select state from the combined producer.

Assuming we have the [same producers from above](#using-multiple-producers), we create selectors for the leaderboard like so:

<Tabs>
<TabItem value="TypeScript" default>

```ts title="selectors/leaderboard.ts"
import { Players } from "@rbxts/services";
import { createSelector } from "@rbxts/reflex";
import { RootState } from "../producer";

export const selectLeaderboardUserIds = (state: RootState) => {
	return state.leaderboard.players;
};

export const selectLeaderboardPlayers = createSelector([selectLeaderboardUserIds], (userIds) => {
	return userIds.mapFiltered((userId) => Players.GetPlayerByUserId(userId));
});
```

</TabItem>
<TabItem value="Luau">

```lua title="selectors/leaderboard.lua"
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Reflex = require(ReplicatedStorage.Packages.reflex)
local producer = require(script.Parent.Parent.producer)

local function selectLeaderboardUserIds(state: producer.RootState)
    return state.leaderboard.players
end

local selectLeaderboardPlayers = Reflex.createSelector(
    { selectLeaderboardUserIds },
    function(userIds: { number })
        local players = {}
        for _, userId in userIds do
            table.insert(players, Players:GetPlayerByUserId(userId))
        end
        return players
    end
)

return {
    selectLeaderboardUserIds = selectLeaderboardUserIds,
    selectLeaderboardPlayers = selectLeaderboardPlayers,
}
```

</TabItem>
</Tabs>

See [`createSelector`](create-selector) for more information on how to create selectors.

---

### Dispatching one action to multiple producers

An interesting caveat of [`combineProducers`](combine-producers) is that combined actions are not scoped to their respective producers. Any name collisions will result in actions stacking and being called together.

**But you can use this to your advantage!** If you want an action to update the state of multiple sub-states at once, it's as simple as using the same name.

**Here's a simple example of dispatching one action to multiple producers:**

<Tabs>
<TabItem value="TypeScript" default>

```ts
const fooProducer = createProducer(0, {
	// highlight-next-line
	increment: (state, value: number) => state + value,
});

const barProducer = createProducer(0, {
	// highlight-next-line
	increment: (state, value: number) => state + value,
});

const producer = combineProducers({
	foo: fooProducer,
	bar: barProducer,
});

// highlight-next-line
producer.increment(1); // { foo: 1, bar: 1 }
```

</TabItem>
<TabItem value="Luau">

```lua
local fooProducer = Reflex.createProducer(0, {
    // highlight-next-line
    increment = function(state, value: number)
        return state + value
    end,
})

local barProducer = Reflex.createProducer(0, {
    // highlight-next-line
    increment = function(state, value: number)
        return state + value
    end,
})

local producer = Reflex.combineProducers({
    foo = fooProducer,
    bar = barProducer,
})

// highlight-next-line
producer.increment(1) --> { foo = 1, bar = 1 }
```

</TabItem>
</Tabs>

Here, `increment` is dispatched once, but it updates the state of both `foo` and `bar`, which originate from different producers. By allowing a name collision, we can dispatch to multiple producers at once.

Some use cases for this include:

-   **Resetting state:** A `reset` action can reset the state of multiple producers at once.

-   **Global events:** A script can dispatch a `playerAdded` action to multiple producers to notify them of a new player.

-   **Modular save data:** A `playerDataLoaded` and `playerDataClosing` action can be dispatched to multiple producers to initialize and clear player data.
