---
description: Learn how to use the 'observe' method to bind logic to entities
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Observers and Entities

Often, you'll want to run code over the lifetime of an entity. You can use [`observe`](../reference/reflex/producer#observeselector-discriminator-observer) for all kinds of lists and records of entities, from players to in-game matches.

:::note what you'll learn

-   📚 What entities and observers are
-   🔍 How to track an entity manually
-   🔗 How to use `observe` to track entities

:::

---

## The Observer pattern

In Reflex, an **entity** is a record of data that represents a player, match, or other object in your game. You can use entities to store data about the object, like its health or position.

An **Observer** is a function that binds some logic to an entity over its _lifetime_. The lifetime of an entity is the time between when it's created and when it's removed from the record.

An Observer can be used to:

-   Spawn players when they're added to an ongoing game
-   Apply temporary status effects to players
-   Clean up connections when players are eliminated or disconnect

And much more! [Read more about the Observer pattern →](https://sleitnick.github.io/RbxObservers/docs/observer-pattern)

---

## Understanding Observers

On [Subscribing to State](subscribing-to-state), you learned how to use [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener), [`once`](../reference/reflex/producer#onceselector-predicate-listener), and [`wait`](../reference/reflex/producer#waitselector-predicate) to run side effects for a player's health bar. But the examples only covered running side effects on _one_ player. How can you bind this extra logic for the lifetime of _every_ player?

We can use `observe` to do this, but to understand how to use `observe`, let's first look at how you might write your own Observer.

A general implementation of Observers requires a few things:

1. A record of entities to track
2. Call the Observer when an entity is **added**, and clean up when it's **removed**
3. A way to identify the entity to track its whole lifetime

### Selecting entities

To track entities, you need a record of them. In the [Player list](subscribing-to-state#player-list) example, the `players` slice stores a map of players by their ID. You can write a selector that returns this record:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { RootState } from "./producer";

export const selectPlayersById = (state: RootState) => {
	return state.players.entities;
};
```

</TabItem>
<TabItem value="Luau">

```lua
local producer = require(script.Parent.producer)

local function selectPlayersById(state: producer.RootState)
    return state.players.entities
end
```

</TabItem>
</Tabs>

### Tracking additions

To track when an entity is added to the record, you can use the current and previous states passed to [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener). When a player is added to the record, the previous state will not have the player, but the current state will. You can use this to filter out new players:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
function entityAdded(entity: PlayerEntity) {
	// Player was added
}

producer.subscribe(selectPlayersById, (current, previous) => {
	for (const [id, player] of pairs(current)) {
		if (previous[id] === undefined) {
			// highlight-next-line
			entityAdded(player);
		}
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function entityAdded(entity: players.PlayerEntity)
    -- Player was added
end

producer:subscribe(selectPlayersByid, function(current, previous)
    for id, player in current do
        if previous[id] == nil then
            // highlight-next-line
            entityAdded(player)
        end
    end
end)
```

</TabItem>
</Tabs>

### Waiting for deletion

To track when an entity is removed from the record, you can use [`once`](../reference/reflex/producer#onceselector-predicate-listener) to create a listener that runs when the entity is not in the new state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
function entityAdded(entity: PlayerEntity) {
	const doesNotHaveEntity = (entities: PlayerEntityRecord) => {
		return entities[entity.id] === undefined;
	};

	// highlight-start
	producer.once(selectPlayersById, doesNotHaveEntity, () => {
		// Player was removed
	});
	// highlight-end
}
```

</TabItem>
<TabItem value="Luau">

```lua
local function entityAdded(entity: players.PlayerEntity)
    local function doesNotHaveEntity(entities: players.PlayerEntityRecord)
        return entities[entity.id] == nil
    end

    // highlight-start
    producer:once(selectPlayersById, doesNotHaveEntity, function()
        -- Player was removed
    end)
    // highlight-end
end
```

</TabItem>
</Tabs>

### Calling the Observer

Now that you have a way to track entities, you can connect an Observer to the entity's lifetime:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="Observer"
function playerObserver(player: PlayerEntity) {
	// Player was added

	return () => {
		// Player was removed
	};
}
```

```ts title="Observer handler"
function entityAdded(entity: PlayerEntity) {
	const doesNotHaveEntity = (entities: PlayerEntityRecord) => {
		return entities[entity.id] === undefined;
	};

	// highlight-next-line
	const cleanup = playerObserver(entity);

	producer.once(selectPlayersById, doesNotHaveEntity, () => {
		// highlight-next-line
		cleanup();
	});
}

producer.subscribe(selectPlayersById, (current, previous) => {
	for (const [id, player] of pairs(current)) {
		if (previous[id] === undefined) {
			entityAdded(player);
		}
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua title="Observer"
local function playerObserver(player: players.PlayerEntity)
    -- Player was added

    return function()
        -- Player was removed
    end
end
```

```lua title="Observer handler"
local function entityAdded(entity: players.PlayerEntity)
    local function doesNotHaveEntity(entities: players.PlayerEntityRecord)
        return entities[entity.id] == nil
    end

    // highlight-next-line
    local cleanup = playerObserver(entity)

    producer:once(selectPlayersById, doesNotHaveEntity, function()
        // highlight-next-line
        cleanup()
    end)
end

producer:subscribe(selectPlayersById, function(current, previous)
    for id, player in current do
        if previous[id] == nil then
            entityAdded(player)
        end
    end
end)
```

</TabItem>
</Tabs>

**We've brought the Observer pattern into Reflex!** You can run side effects in the `playerObserver` function, and clean them up when the Observer is removed.

While this works, it's a lot of code to write for something that should be simple. This is where `observe` comes in.

---

## Create Observers with `observe`

The [`observe`](../reference/reflex/producer#observeselector-discriminator-observer) method is a shorthand for creating Observers. It takes a _selector_, a _discriminator_, and an _Observer_ function.

1. The **selector** is used to select a record of entities to track, and it can return an array or a dictionary. We will use the [`selectPlayersById`](#selecting-entities) selector from earlier.
2. The **discriminator** is a function that takes the current state and returns a value that uniquely identifies the entity. We will use the `id` property of the entity.
3. The **Observer** function runs when an entity is added, and returns an optional cleanup function that runs when the entity is removed.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const getPlayerId = (player: PlayerEntity) => {
	return player.id;
};

producer.observe(selectPlayersById, getPlayerId, (player) => {
	// Player was added

	return () => {
		// Player was removed
	};
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function getPlayerId(player: players.PlayerEntity)
    return player.id
end

producer:observe(selectPlayersById, getPlayerId, function(player)
    -- Player was added

    return function()
        -- Player was removed
    end
end)
```

</TabItem>
</Tabs>

**This is essentially the same as our custom Observers, but with _much_ less code!** The `observe` method will automatically track when the entity is added and removed, and run the Observer function accordingly.

:::info

-   **If the record is already populated with entities,** the Observer function will be initialized for each entity in the record when you call `observe`.

-   **The discriminator function is optional.** If you don't provide one, the entity itself will be used as the discriminator. This is only recommended if the entity is a primitive value, like a string or number.

:::

### Observing individual players

On [Subscribing to State](subscribing-to-state), we left off at playing a sound when one player gets damaged. We made a [selector factory](using-selectors#passing-arguments-to-selectors) to select the health of a player by ID, wrote a `didDecrease` predicate to check if the health decreased, and subscribed to decreases in health:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectPlayerHealthById = (id: string) => {
	return (state: RootState) => {
		return state.players.entities[id].health;
	};
};

const didDecrease = (current: number, previous: number) => {
	return current < previous;
};

const selectHealth = selectPlayerHealthById("Player1");

// highlight-start
producer.subscribe(selectHealth, didDecrease, () => {
	// Play sound
});
// highlight-end
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectPlayerHealthById(id: string)
    return function(state: RootState)
        return state.players.entities[id].health
    end
end

local function didDecrease(current: number, previous: number)
    return current < previous
end

local selectHealth = selectPlayerHealthById("Player1")

// highlight-start
producer:subscribe(selectHealth, didDecrease, function()
    -- Play sound
end)
// highlight-end
```

</TabItem>
</Tabs>

But now that we can observe the lifetime players, we can use `observe` to play a sound when any player gets damaged:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.observe(selectPlayersById, getPlayerId, (player) => {
	const selectHealth = selectPlayerHealthById(player.id);

	// highlight-start
	return producer.subscribe(selectHealth, didDecrease, () => {
		// Play sound
	});
	// highlight-end
});
```

</TabItem>
<TabItem value="Luau">

```lua
producer:observe(selectPlayersById, getPlayerId, function(player)
    local selectHealth = selectPlayerHealthById(player.id)

    // highlight-start
    return producer:subscribe(selectHealth, didDecrease, function()
        -- Play sound
    end)
    // highlight-end
end)
```

</TabItem>
</Tabs>

:::tip

The [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-handler) method returns a cleanup function that disconnects the listener. We can return this function as our Observer's cleanup function.

:::

---

## Summary

**You're now ready to use Reflex in your games!** The guides from here on out will focus on more advanced topics, but you can always refer back to the earlier guides if you need a refresher.

Let's recap what we've learned about Observers:

-   **Entities** are unique objects that can be added and removed from the state.
-   **Observers** are functions that run over the lifetime of an entity.
-   To create an observer, call [`observe`](../reference/reflex/producer#observeselector-discriminator-observer) with a selector, a discriminator, and an Observer function.
