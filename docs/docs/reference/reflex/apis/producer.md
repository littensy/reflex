---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Producer

A producer is a state container with built-in functions to update state and run side effects. To create one, use [`createProducer`](create-producer).

```ts
const producer = createProducer(initialState, actions);
```

<TOCInline toc={toc} />

---

## Reference

### `action` functions

Actions are functions that update the producer's state. They are created by passing an object of action functions to [`createProducer`](create-producer).

You can dispatch an action by calling it on the producer:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(0, {
	increment: (state, value: number) => state + value,
});

// highlight-next-line
producer.increment(1); // 1
```

</TabItem>
<TabItem value="Luau">

```lua
local producer = Reflex.createProducer(0, {
    increment = function(state, value: number): number
        return state + value
    end,
})

// highlight-next-line
producer.increment(1) --> 1
```

</TabItem>
</Tabs>

[See how to create actions here.](create-producer#updating-state)

#### Parameters

-   `...args` - The parameters to pass to the action function.

#### Returns

Dispatching returns the new state of the producer.

---

### `getState(selector?)`

Producers allow you to access the current state by calling `getState`. You can optionally pass a selector function to `getState` to select a specific part of the state.

<Tabs>
<TabItem value="TypeScript" default>

```ts
producer.getState(); // { count: 0 }
producer.getState((state) => state.count); // 0
```

</TabItem>
<TabItem value="Luau">

```lua
producer:getState() --> { count = 0 }
producer:getState(function(state)
    return state.count
end) --> 0
```

</TabItem>
</Tabs>

#### Parameters

-   **optional** `selector` - A function that selects a part of the state. If not provided, the entire state is returned.

#### Returns

`getState` returns the current state of the producer, or the result of the `selector` if one is provided.

---

### `subscribe(selector?, listener)`

The `subscribe` method lets you listen for changes to the producer's state. Generally, you should pass a selector function to `subscribe` to only listen for changes to a subset of the state.

To unsubscribe from a listener, call the function returned by `subscribe`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectCount = (state: State) => state.count;

const unsubscribe = producer.subscribe(selectCount, (count, prevCount) => {
	print(count, prevCount);
});

producer.increment(1); // 1, 0
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectCount(state)
    return state.count
end

local unsubscribe = producer:subscribe(selectCount, function(count, prevCount)
    print(count, prevCount)
end)

producer.increment(1) --> 1, 0
```

</TabItem>
</Tabs>

[See more examples below.](#running-side-effects)

#### Parameters

-   **optional** `selector` - A function that selects a part of the state. If not provided, the entire state is passed to the listener.

-   `listener` - A function that is called when the state changes. The function receives the state as its first argument, and the previous state as its second argument.

#### Returns

`subscribe` returns a function that can be called to unsubscribe the listener.

:::info Caveats

-   If you pass a selector to `subscribe`, the listener will only be called once the selector returns a new value. Changes are compared **by reference (`===`)**, so if your selector creates a new object, remember to [memoize it with `createSelector`.](create-selector)

-   State updates within a `subscribe` event should only be done in response to a selected state or under certain conditions. Otherwise, you may end up in an infinite loop.

-   Listeners are called synchronously **on the frame after an action is dispatched**. This means that if you dispatch multiple actions in the same frame, listeners will only be called once with the final state.

-   Similar to Redux, if you subscribe, unsubscribe, or change state while a listener is being called, the changes will not affect the current dispatch. However, they will affect the next dispatch.

:::

---

### `once(selector, predicate?, listener)`

`once` lets you listen for a single change to the producer's state. It works similarly to [`subscribe`](#subscribeselector-listener), but the listener is automatically unsubscribed after the first call. If the predicate is provided, the listener will only be called if the predicate returns `true`.

To unsubscribe from a listener, call the function returned by `once`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectCounter = (state: State) => state.count;

const isGreaterThanOne = (count: number) => count > 1;

producer.once(selectCounter, isGreaterThanOne, (count, prevCount) => {
	print(count, "is greater than 1");
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectCounter(state)
    return state.count
end

local function isGreaterThanOne(count)
    return count > 1
end

producer:once(selectCounter, isGreaterThanOne, function(count, prevCount)
    print(count, "is greater than 1")
end)
```

</TabItem>
</Tabs>

[See more examples below.](#waiting-for-state-changes)

#### Parameters

-   `selector` - A function that selects a part of the state.

-   **optional** `predicate` - A function that determines whether the listener should be called. If not provided, the listener will be called once the selected state changes.

-   `listener` - A function that is called when the state changes. The function receives the new state as its first argument, and the state from the time of subscription as its second argument.

#### Returns

`once` returns a function that can be called to unsubscribe the listener.

:::info Caveats

-   `once` has the [same caveats](#caveats) as [`subscribe`](#subscribeselector-listener).

-   If the predicate returns `true` at the time of subscription, the listener **will not** be called immediately. It will only be called once the selected state changes, and only if the predicate returns `true` at that time. This behavior is analogous to `Promise.fromEvent` and how it waits for the _next_ event.

:::

---

### `wait(selector, predicate?)`

`wait` returns a promise that resolves once the selected state changes. If the predicate is provided, the promise will only resolve if the predicate returns `true`.

To unsubscribe from a listener, cancel the promise returned by `wait`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectCounter = (state: State) => state.count;

const isGreaterThanOne = (count: number) => count > 1;

producer.wait(selectCounter, isGreaterThanOne).then((count) => {
	print(count, "is greater than 1");
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectCounter(state)
    return state.count
end

local function isGreaterThanOne(count)
    return count > 1
end

producer:wait(selectCounter, isGreaterThanOne):andThen(function(count)
    print(count, "is greater than 1")
end)
```

</TabItem>
</Tabs>

[See more examples below.](#waiting-for-state-changes)

#### Parameters

-   `selector` - A function that selects a part of the state.

-   **optional** `predicate` - A function that determines whether the promise should resolve. If not provided, the promise will resolve once the selected state changes.

#### Returns

`wait` returns a promise that resolves once the selected state changes _and_ the predicate returns `true`.

:::info Caveats

-   `wait` has the [same caveats](#caveats) as [`subscribe`](#subscribeselector-listener).

-   If the predicate returns `true` at the time `wait` is called, the Promise **will not** resolve immediately. It will only be resolve once the selected state changes, and only if the predicate returns `true` at that time. This behavior is analogous to `Promise.fromEvent` and how it waits for the _next_ event.

:::

---

### `observe(selector, discriminator?, observer)`

`observe` lets you track the addition and removal of a **unique item** in the producer's state. The selector may return an array or a record of items. When an item is added, the Observer is called with the item, and cleaned up when the item is removed.

The **discriminator** is used to differentiate between items. If the discriminator is not provided, the item is tracked by its reference in the record. If the discriminator is provided, the item is tracked by the result of the discriminator.

To unsubscribe from an Observer, call the function returned by `observe`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectTodos = (state: State) => state.todos;

const identifyTodo = (todo: Todo) => todo.id;

producer.observe(selectTodos, identifyTodo, (todo) => {
	print(todo, "was added");

	return () => {
		print(todo, "was removed");
	};
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectTodos(state)
    return state.todos
end

local function identifyTodo(todo)
    return todo.id
end

producer:observe(selectTodos, identifyTodo, function(todo)
    print(todo, "was added")

    return function()
        print(todo, "was removed")
    end
end)
```

</TabItem>
</Tabs>

[See more examples below.](#observing-additions-and-removals)

#### Parameters

-   `selector` - A function that selects a part of the state.

-   **optional** `discriminator` - A function that returns a unique identifier for an item. If not provided, the item is tracked by its reference in the record.

-   `observer` - Called when an item is added to the record. It returns an optional cleanup function that is called when the item is removed from the state.

#### Returns

`observe` returns a function that can be called to unsubscribe from the state and clean up all Observers.

:::info Caveats

-   **Passing a discriminator is highly recommended when tracking unique objects.** This is because immutable objects are compared by reference. If you pass a record of objects without a discriminator, the Observer will be called every time an object is updated.

-   **The discriminator must return a unique value for each item.** If two items have the same discriminator, Observers will track the first to be added or removed.

-   **The Observer is called immediately for each item in the initial state.** This means that if the state is already populated with items, the Observer will be called for each item.

-   **The first argument of the Observer is the item that was added.** It acts as an initial state and **does not update** when the item is updated.

:::

---

### `flush()`

The `flush` method is used to immediately run a scheduled update. This is useful for forcing an update to run synchronously, but should generally be avoided.

<Tabs>
<TabItem value="TypeScript" default>

```ts
producer.flush();
```

</TabItem>
<TabItem value="Luau">

```lua
producer:flush()
```

</TabItem>
</Tabs>

:::info Caveats

-   `flush` should not be called during a state update. Doing so might cause unexpected behavior.

:::

---

### `applyMiddleware(...middlewares)`

The `applyMiddleware` method is used to apply middleware to the producer. Middleware can be used to enhance producers, dispatch actions, or perform side effects.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const loggerMiddleware: ProducerMiddleware = (producer) => {
	print("initial state:", producer.getState());

	producer.subscribe((state) => {
		print("next state:", state);
	});

	return (dispatch, name) => {
		return (...args) => {
			print(`dispatching ${name}:`, ...args);
			return dispatch(...args);
		};
	};
};

producer.applyMiddleware(loggerMiddleware);
```

</TabItem>
<TabItem value="Luau">

```lua
local loggerMiddleware: Reflex.Middleware = function(producer)
    print("initial state:", producer:getState())

    producer:subscribe(function(state)
        print("next state:", state)
    end)

    return function(dispatch, name)
        return function(...)
            print("dispatching", name, ...)
            return dispatch(...)
        end
    end
end

producer:applyMiddleware(loggerMiddleware)
```

</TabItem>
</Tabs>

[See more examples below.](#using-middleware)

#### Parameters

-   `...middlewares` - A list of middleware functions. The middleware functions are called in the order they are provided.

#### Returns

`applyMiddleware` returns the original producer.

:::info Caveats

-   Middleware functions have **three layers** of abstraction: the producer, the dispatch function, and individual dispatches. The producer is the **highest level of abstraction** and is called once when applying the middleware. The dispatch function is the **middle layer of abstraction** and called with the dispatch functions in the producer. The individual dispatches are the **lowest level of abstraction** and run before each dispatch.

-   **Middleware functions are called in the order they are provided.** This means that middleware functions that depend on other middleware functions should be provided after their dependencies.

-   **The return value matters!** Middleware functions can intercept dispatches and make them return a value other than the new state. If a middleware function returns a value, the next middleware function will receive that value, and eventually will be returned by the dispatch function.

:::

---

## Usage

### Running side effects

Games often have a lot of state that changes over time. For example, a producer might contain a player's health, money, and inventory. You will sometimes need to perform side effects for certain state updates. Let's first look at how to subscribe to state changes, and then we'll cover which cases you should use it for.

To subscribe to state changes, use the [`subscribe`](#subscribeselector-listener) method:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectCount = (state: State) => state.count;

producer.subscribe(selectCount, (count) => {
	print("count changed:", count);
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectCount(state)
    return state.count
end

producer:subscribe(selectCount, function(count, prevCount)
    print("count changed:", count)
end)
```

</TabItem>
</Tabs>

You pass two parameters to the `subscribe` method:

1.  A `selector` that returns the part of the state you want to subscribe to.
2.  A `listener` that is called when the selected part of the state changes.

Once you have subscribed to state changes, you can perform side effects in the listener function. The listener will be called once the selector returns a new value after a state update.

**Say you have a game where the player's health is stored in the state:**

<Tabs>
<TabItem value="TypeScript" default>

```ts
interface RootState {
	readonly health: number;
}

const initialState: RootState = {
	health: 100,
};

const producer = createProducer(initialState, {
	takeDamage: (state, health: number) => ({
		...state,
		health: state.health - health,
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua
type RootState = {
    health: number,
}

type RootDispatchers = {
    takeDamage: (health: number) -> void,
}

local initialState = {
    health = 100,
}

local producer = createProducer(initialState, {
    takeDamage = function(state, health)
        local nextState = table.clone(state)
        nextState.health -= health
        return nextState
    end,
}) :: Reflex.Producer<RootState, RootDispatchers>
```

</TabItem>
</Tabs>

Your producer has an action to deal damage to the player, but it's not good practice to run side effects in actions. So, how can you run a side effect when damage is dealt?

**You can do this by subscribing to a selector that returns the player's health:**

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectHealth = (state: RootState) => state.health;

producer.subscribe(selectHealth, (health, prevHealth) => {
	if (health < prevHealth) {
		playDamageSound();
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectHealth(state)
    return state.health
end

producer:subscribe(selectHealth, function(health, prevHealth)
    if health < prevHealth then
        playDamageSound()
    end
end)
```

</TabItem>
</Tabs>

**This code calls the `playDamageSound` function whenever the player's health decreases.** The listener is called with the new health and the previous health. If the new health is less than the previous health, the listener plays a sound.

But what if you want to wait for some specific state change to occur? [Producers provide methods for that, too!](#waiting-for-state-changes)

---

### Waiting for state changes

Sometimes, you want to wait for a specific state change before performing a side effect.

For example, say your state contains a `jumping` boolean that is set to `true` when the player holds down the jump button. You want it to run a `jump()` function in a loop, and disconnect it when it stops. One way to do this is with [`once`](#onceselector-predicate-listener).

This code calls the function while the `jumping` state is `true`, and then stops once the `jumping` state becomes `false`:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectJumping = (state: RootState) => state.jumping;

const isFalse = (value: boolean) => value === false;

producer.subscribe(selectJumping, (jumping) => {
	if (jumping) {
		const heartbeat = RunService.Heartbeat.Connect(jump);

		producer.once(selectJumping, isFalse, (jumping) => {
			heartbeat.Disconnect();
		});
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectJumping(state)
    return state.jumping
end

local function isFalse(value)
    return value == false
end

producer:subscribe(selectJumping, function(jumping)
    if jumping then
        local heartbeat = RunService.Heartbeat:Connect(jump)

        producer:once(selectJumping, isFalse, function(jumping)
            heartbeat:Disconnect()
        end)
    end
end)
```

</TabItem>
</Tabs>

**The [`once`](#onceselector-predicate-listener) method receives three parameters:**

1.  A `selector` that returns the part of the state you want to subscribe to
2.  An optional `predicate` that returns `true` when the state change you are waiting for has occurred
3.  A `listener` that is called when the state has changed

The `predicate` parameter is optional. If you pass a predicate, the listener will only be called when the predicate returns `true`. Otherwise, the listener will be called when the selector returns a new value.

Producers also provide [`wait`](#waitselector-predicate), a shorthand for [`once`](#onceselector-predicate-listener) that returns a promise:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectJumping = (state: RootState) => state.jumping;

const isFalse = (value: boolean) => value === false;

async function startJumping() {
	const heartbeat = RunService.Heartbeat.Connect(jump);

	return producer.wait(selectJumping, isFalse).finally(() => {
		heartbeat.Disconnect();
	});
}

producer.subscribe(selectJumping, (jumping) => {
	if (jumping) {
		startJumping();
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectJumping(state)
    return state.jumping
end

local function isFalse(value)
    return value == false
end

local function startJumping()
    local heartbeat = RunService.Heartbeat:Connect(jump)

    return producer:wait(selectJumping, isFalse):finally(function()
        heartbeat:Disconnect()
    end)
end

producer:subscribe(selectJumping, function(jumping)
    if jumping then
        startJumping()
    end
end)
```

</TabItem>
</Tabs>

---

### Deriving new data from state

**A good rule of thumb is to keep your state as simple as possible.** This includes avoiding redundant data that can be derived from other parts of the state. However, that might make it harder to perform side effects on your existing state. How can you **derive new data** from the state without changing it?

Say your game's state contains a list of players, and each player has a `health` and `id` property. If you want to retrieve a list of players that are alive, you can create a **selector** that creates a new list of players from the existing state:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectPlayers = (state: RootState) => state.players;

const selectAlivePlayers = createSelector([selectPlayers] as const, (players) => {
	return players.filter((player) => player.health > 0);
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectPlayers(state)
    return state.players
end

local selectAlivePlayers = Reflex.createSelector({ selectPlayers }, function(players)
    local alivePlayers = {}

    for _, player in players do
        if player.health > 0 then
            table.insert(alivePlayers, player)
        end
    end

    return alivePlayers
end)
```

</TabItem>
</Tabs>

:::info

**Using [`createSelector`](create-selector) for deriving new objects is good practice.** It allows you to **memoize** a selector and cache its results. Note that this is best used when the selector **returns a new object** (mapping, filtering, etc.) or **performs a heavy computation**. A simple table index does not need to be memoized.

**This is because state changes are determined by reference equality (`===`).** If Reflex calls your selector and it always returns a new table, Reflex will think that the state has changed **every time** the selector is called. This can lead to performance issues down the line.

:::

**With this selector, you can subscribe to changes in the list of alive players.** Your original state hasn't changed, but you can now filter out the players that are alive and perform side effects based on that.

For example, you can run some code whenever a player is filtered from the list of alive players:

<Tabs>
<TabItem value="TypeScript" default>

```ts
producer.subscribe(selectAlivePlayers, (alivePlayers, prevAlivePlayers) => {
	for (const player of prevAlivePlayers) {
		const stillAlive = alivePlayers.some((p) => p.id === player.id);

		if (!stillAlive) {
			playerDied(player);
		}
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function hasPlayer(players, id)
    for _, player in players do
        if player.id == id then
            return true
        end
    end

    return false
end

producer:subscribe(selectAlivePlayers, function(alivePlayers, prevAlivePlayers)
    for _, player in prevAlivePlayers do
        if not hasPlayer(alivePlayers, player.id) then
            playerDied(player)
        end
    end
end)
```

</TabItem>
</Tabs>

**But finding differences between lists can quickly get cumbersome.** What if you want to track the health of a specific player? Or what if you want to clean up some state when a player dies?

This is where the [`observe`](#observeselector-discriminator-observer) method comes in handy. [See how to use it in the next section.](#observing-additions-and-removals)

---

### Observing additions and removals

**Game state often contains many lists and records of data.** You will likely need to run code when a new item is added to a record, or clean something up when the item is removed. We'll explore Observers, their use cases, and using [`observe`](#observeselector-discriminator-observer).

**Reflex brings the [Observer pattern](https://sleitnick.github.io/RbxObservers/docs/observer-pattern) to immutable state management.** Some good use cases for [`observe`](#observeselector-discriminator-observer) include:

-   Managing the lifecycle of a match in a multiplayer game
-   Spawning players and cleaning up when they die or leave the game
-   Applying temporary status effects to players

Let's say your state has a list of players, and each player has a `health` and `id` property. You want to play a sound whenever a player is damaged or dies. To help track individual players, you should first create a [memoized selector](#deriving-new-data-from-state) that selects a player's health by their ID:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectPlayers = (state: RootState) => state.players;

const selectPlayerById = (id: number) => {
	return createSelector([selectPlayers] as const, (players) => {
		return players.find((player) => player.id === id);
	});
};

// highlight-start
const selectPlayerHealth = (id: number) => {
	return createSelector([selectPlayerById(id)] as const, (player) => {
		return player?.health;
	});
};
// highlight-end

producer.subscribe(selectPlayerHealth(123), (health, prevHealth) => {
	// ...
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectPlayers(state)
    return state.players
end

local function selectPlayerById(id)
    return Reflex.createSelector({ selectPlayers }, function(players)
        for _, player in players do
            if player.id == id then
                return player
            end
        end
    end)
end

// highlight-start
local function selectPlayerHealth(id)
    return Reflex.createSelector({ selectPlayerById(id) }, function(player)
        return player and player.health
    end)
end
// highlight-end

producer:subscribe(selectPlayerHealth(123), function(health, prevHealth)
    -- ...
end)
```

</TabItem>
</Tabs>

:::info

**`selectPlayerById` and `selectPlayerHealth` are selector creators.** Creators are useful when you want to create a reusable selector that is memoized for a specific set of inputs. [See more on why this approach helps with performance](create-selector).

:::

**Now you can subscribe to changes in a specific player's health!** But creating this subscription for new players and unsubscribing when they are removed can be difficult to set up. This is where the [`observe`](#observeselector-discriminator-observer) method comes in handy.

[`observe`](#observeselector-discriminator-observer) takes a **selector**, an optional **discriminator**, and an **Observer**. The selector returns a list or record of items, in which the Observer is called when a unique item is added. The Observer may return a **cleanup function** that is automatically called when the item is removed from the list.

**This code observes the lifetime of the players that are currently alive.** The Observer can then subscribe to changes in the player's health, and run side effects when the player is damaged or dies. When the player is removed from the list, that means they are no longer alive, and the cleanup function is called.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const discriminator = (player: GamePlayer) => player.id;

producer.observe(selectAlivePlayers, discriminator, (initialPlayer) => {
	const { id } = initialPlayer;

	const unsubscribe = producer.subscribe(selectPlayerHealth(id), (health, prevHealth) => {
		if (health < prevHealth) {
			playerDamaged();
		}
	});

	return () => {
		unsubscribe();
		playerDied();
	};
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function discriminator(player)
    return player.id
end

producer:observe(selectAlivePlayers, discriminator, function(initialPlayer)
    local id = initialPlayer.id

    local unsubscribe = producer:subscribe(selectPlayerHealth(id), function(health, prevHealth)
        if health < prevHealth then
            playerDamaged()
        end
    end)

    return function()
        unsubscribe()
        playerDied()
    end
end)
```

</TabItem>
</Tabs>

:::info

**Remember to pass a discriminator function to [`observe`](#observeselector-discriminator-observer) if you're observing objects!** Because of the nature of immutable data, discriminators are necessary to ensure an Observer exists through the entire lifecycle of an object.

:::

[`observe`](#observeselector-discriminator-observer) receives three parameters:

1.  A `selector` that returns a list or record of entries.
2.  An optional `discriminator` function that returns a unique identifier for each entry.
3.  An `observer` function that is called when an entry is added, and returns a cleanup function that is called when the entry is removed.

The discriminator is optional in the case that your list contains primitives like strings and numbers:

<Tabs>
<TabItem value="TypeScript" default>

```ts
// highlight-start
const selectPlayerIds = createSelector([selectPlayers] as const, (players) => {
	return players.map((player) => player.id);
});
// highlight-end

producer.observe(selectPlayerIds, (id: number) => {
	// mounted
	return () => {
		// unmounted
	};
});
```

</TabItem>
<TabItem value="Luau">

```lua
// highlight-start
local selectPlayerIds = Reflex.createSelector({ selectPlayers }, function(players)
    local ids = {}
    for index, player in players do
        ids[index] = player.id
    end
    return ids
end)
// highlight-end

producer:observe(selectPlayerIds, function(id: number)
    -- mounted
    return function()
        -- unmounted
    end
end)
```

</TabItem>
</Tabs>

---

### Using middleware

**Middleware is a powerful tool for extending the behavior of producers and actions.** In Reflex, middleware can be used to add logging, cancel actions, analytics, add undo/redo functionality, and more.

**This example is a custom implementation of `loggerMiddleware`:**

<Tabs>
<TabItem value="TypeScript" default>

```ts
const loggerMiddleware: ProducerMiddleware = (producer) => {
	// First level, called by applyMiddleware

	producer.subscribe((state) => {
		print("state changed to", state);
	});

	return (dispatch, name) => {
		// Second level, called per action function

		return (...args) => {
			// Third level, called before action dispatch

			print("dispatching", name, "with", args);

			return dispatch(...args);
		};
	};
};

producer.applyMiddleware(loggerMiddleware);
```

</TabItem>
<TabItem value="Luau">

```lua
local loggerMiddleware: Reflex.Middleware = function(producer)
    -- First level, called by applyMiddleware

    producer:subscribe(function(state)
        print("state changed to", state)
    end)

    return function(dispatch, name)
        -- Second level, called action function

        return function(...)
            -- Third level, called before action dispatch

            print("dispatching", name, "with", ...)

            return dispatch(...)
        end
    end
end

producer:applyMiddleware(loggerMiddleware)
```

</TabItem>
</Tabs>

**A middleware has three layers of control that allow you to fine-tune behavior:**

1.  **The producer**
    -   The first level, the middleware itself, is called when it is applied to a producer.
    -   You can make subscriptions or patch methods here.
2.  **An action**
    -   The second level is called once for every action in the producer, and receives a `dispatch` function and the action name.
    -   You might log a list of actions or permanently disable an action here.
3.  **On dispatch**
    -   The final level receives the action's arguments and calls `dispatch` to invoke the next middleware in the chain.
    -   You can cancel an action or log individual dispatches here.

:::tip

**The third level of middleware acts as a wrapper for actions.** Calling `dispatch` will invoke the next middleware in the chain, or the action if it is the last middleware.

Additionally, changing the arguments or return value in the third level will **pass them on** to the next middleware or action.

:::

---

### Using multiple producers

**Reflex is best used with a single producer holding the entire state of your application.**

It's good practice to organize state into different producers, and combine them with [`combineProducers`](combine-producers). [See the documentation for more details.](combine-producers)
