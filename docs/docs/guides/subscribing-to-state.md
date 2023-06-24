---
description: Learn the different ways to subscribe to state changes with Reflex
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Subscribing to State

On [Using Selectors](using-selectors), we learned how to use selectors to read and subscribe to state from the store. Reflex provides a few more useful ways to subscribe to state changes with selectors.

:::note we discuss:

-   🌎 Common use cases for subscribing to state
-   🔌 Different ways to subscribe to state
-   📚 How to use [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener), [`once`](../reference/reflex/producer#onceselector-predicate-listener), and [`wait`](../reference/reflex/producer#waitselector-predicate)

:::

---

## Player list

Say your state had a `players` slice that stored the health of each player in a game:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="players.ts" showLineNumbers
import { createProducer } from "@rbxts/reflex";

interface PlayersState {
	readonly entities: {
		readonly [id: string]: PlayerEntity;
	};
}

export interface PlayerEntity {
	readonly health: number;
}

const initialState: PlayersState = {
	players: {},
};

export const playersSlice = createProducer(initialState, {
	addPlayer: (state, id: string) => ({
		...state,
		players: { ...state.players, [id]: { health: 100 } },
	}),

	setPlayerHealth: (state, id: string, health: number) => ({
		...state,
		players: { ...state.players, [id]: { health } },
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua title="players.lua" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

export type PlayersState = {
    entities: { [string]: PlayerEntity },
}

export type PlayersActions = {
    addPlayer: (id: string) -> (),
    setPlayerHealth: (id: string, health: number) -> (),
}

export type PlayerEntity = {
    health: number,
}

local initialState: PlayersState = {
    entities = {},
}

local playersSlice = Reflex.createProducer(initialState, {
    addPlayer = function(state, id: string)
        local nextState = table.clone(state)
        local nextEntities = table.clone(state.entities)
        nextEntities[id] = { health = 100 }
        nextState.entities = nextEntities
        return nextState
    end,

    setPlayerHealth = function(state, id: string, health: number)
        local nextState = table.clone(state)
        local nextEntities = table.clone(state.entities)
        nextEntities[id] = { health = health }
        nextState.entities = nextEntities
        return nextState
    end,
})

return { playersSlice = playersSlice }
```

</TabItem>
</Tabs>

The root state has a `players` slice with an `entities` field that contains your player entities. You will often need to run side effects for changes to state when working with entities. For example, you may want to play a sound when a player's health decreases.

### Conditional side effects

You can use [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener) to run side effects when a selector's value changes. In this example, we subscribe to the health of `Player1` and play a sound when their health decreases:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
import { RootState, producer } from "./producer";

const selectPlayerHealthById = (id: string) => {
	return (state: RootState) => {
		return state.players.entities[id].health;
	};
};

const selectHealth = selectPlayerHealthById("Player1");

producer.subscribe(selectHealth, (health, lastHealth) => {
	if (health < lastHealth) {
		// Play sound
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
local producer = require(script.Parent.producer)

local function selectPlayerHealthById(id: string)
    return function(state: producer.RootState)
        return state.players.entities[id].health
    end
end

local selectHealth = selectPlayerHealthById("Player1")

producer:subscribe(selectHealth, function(health, lastHealth)
    if health < lastHealth then
        -- Play sound
    end
end)
```

</TabItem>
</Tabs>

There are a few things to note about this example:

-   **We defined `selectPlayerHealthById`,** a [selector factory](using-selectors#passing-arguments-to-selectors), to create a simple selector that returns the health of a player with a given ID.
-   **Our selector isn't [memoized](using-selectors#transforming-state),** but that's okay. It's not a problem since it's fast and returns a value directly from the state.
-   Our subscription callback receives the **current value** and the **last value** that the listener received. This is useful for comparing values and running conditional side effects.

As a shorthand, you can pass a `predicate` argument to `subscribe` to only run the listener when the predicate returns `true`. In this case, we can use it to only run the listener if the player's health is lower than the last health:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
const didDecrease = (current: number, previous: number) => {
	return current < previous;
};

producer.subscribe(selectHealth, didDecrease, (health, lastHealth) => {
	// Play sound
});
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
local function didDecrease(current: number, previous: number)
    return current < previous
end

producer:subscribe(selectHealth, didDecrease, function(health, lastHealth)
    -- Play sound
end)
```

</TabItem>
</Tabs>

### One-time side effects

You can use [`once`](../reference/reflex/producer#onceselector-predicate-listener) to only run a listener the next time a value changes. If you want to end the game once the player's health reaches `0`, you can use `once`:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
const isDead = (health: number) => {
	return health <= 0;
};

producer.once(selectHealth, isDead, () => {
	// End game
});
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
local function isDead(health: number)
    return health <= 0
end

producer:once(selectHealth, isDead, function()
    -- End game
end)
```

</TabItem>
</Tabs>

Once the player's health reaches `0`, the listener will be disconnected and the game will end.

### Async side effects

You can also use [`wait`](../reference/reflex/producer#waitselector-predicate), which returns a Promise that resolves with the new value. This is especially useful for running side effects in async functions:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
async function startGame() {
	producer.setGameStatus("started");

	return producer.wait(selectHealth, isDead).then(() => {
		producer.setGameStatus("finished");
	});
}
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
function startGame()
    producer.setGameStatus("started")

    return producer:wait(selectHealth, isDead):andThen(function()
        producer.setGameStatus("finished")
    end)
end
```

</TabItem>
</Tabs>

This uses [`wait`](../reference/reflex/producer#waitselector-predicate) to determine when to end the game, and can be chained off of to start the next game. You can apply the same logic to other side effects, like ending multiplayer matches or showing a game over screen.

### Observing individual players

You learned how to run side effects for _one_ player, but what if you want to run individual side effects for _each_ player? We will learn how to use [`observe`](../reference/reflex/producer#observeselector-discriminator-observer) in the next section.

---

## Summary

-   You can create **conditional side effects** by passing a `predicate` function.
-   [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener) runs a listener when a selector's value changes.
-   [`once`](../reference/reflex/producer#onceselector-predicate-listener) runs a listener the next time a selector's value changes, then disconnects.
-   [`wait`](../reference/reflex/producer#waitselector-predicate) returns a Promise that resolves with the next value of a selector.
