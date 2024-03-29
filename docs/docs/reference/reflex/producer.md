---
sidebar_position: 2
description: Manage your game's state with producers.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TOCInline from "@theme/TOCInline";

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

<Tabs groupId="languages">
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

[See how to create actions here.](create-producer#updating-state-with-actions)

#### Parameters

-   `...args` - The parameters to pass to the action function.

#### Returns

Dispatching returns the new state of the producer.

---

### `getState(selector?)`

Producers allow you to access the current state by calling `getState`. You can optionally pass a selector function to `getState` to select a specific part of the state.

<Tabs groupId="languages">
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

### `setState(newState)`

`setState` lets you manually update the state of the producer. It is generally recommended to use actions instead of `setState` to update state.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.setState({ count: 1 });
```

</TabItem>
<TabItem value="Luau">

```lua
producer:setState({ count = 1 })
```

</TabItem>
</Tabs>

#### Parameters

-   `newState` - The new state of the producer.

#### Returns

`setState` does not return anything.

---

### `resetState()`

`resetState` lets you reset the state of the producer to the initial value passed to [`createProducer`](create-producer). It's useful for debugging and resetting state between tests.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.resetState();
```

</TabItem>
<TabItem value="Luau">

```lua
producer:resetState()
```

</TabItem>
</Tabs>

#### Returns

`resetState` does not return anything.

---

### `clone()`

`clone` returns a new producer with the same state and actions as the original producer. It's useful for creating separate instances of a producer in unit tests.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const clone = producer.clone();
```

</TabItem>
<TabItem value="Luau">

```lua
local clone = producer:clone()
```

</TabItem>
</Tabs>

#### Returns

`clone` returns a new copy of the producer.

:::info Caveats

-   `clone` does not copy middleware or subscriptions. You will need to reapply middleware as needed.

:::

---

### `getActions()`

`getActions` returns the action functions passed to [`createProducer`](create-producer). This can be useful for [filtering actions in a broadcaster](create-broadcaster#filtering-actions).

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const actions = producer.getActions();
```

</TabItem>
<TabItem value="Luau">

```lua
local actions = producer:getActions()
```

</TabItem>
</Tabs>

#### Returns

`getActions` returns the producer's action functions.

---

### `subscribe(selector?, predicate?, listener)`

The `subscribe` method lets you listen for changes to the producer's state. Generally, you should pass a selector function to `subscribe` to only listen for changes to a subset of the state.

To unsubscribe from a listener, call the function returned by `subscribe`.

<Tabs groupId="languages">
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

You may optionally pass a predicate function to `subscribe` to only listen for changes that match a certain condition. If the predicate is provided, the listener will only be called if the predicate returns `true`.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectCount = (state: State) => state.count;

const isEven = (count: number) => count % 2 === 0;

producer.subscribe(selectCount, isEven, (count, prevCount) => {
	print(count, prevCount);
});

producer.increment(1);
producer.increment(1); // 2, 0
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectCount(state)
    return state.count
end

local function isEven(count: number)
    return count % 2 == 0
end

producer:subscribe(selectCount, isEven, function(count, prevCount)
    print(count, prevCount)
end)

producer.increment(1)
producer.increment(1) --> 2, 0
```

</TabItem>
</Tabs>

[See more examples below.](#running-side-effects)

#### Parameters

-   **optional** `selector` - A function that selects a part of the state. If not provided, the entire state is passed to the listener.

-   **optional** `predicate` - A function that determines whether the listener should be called. If not provided, the listener will always be called.

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

`once` lets you listen for a single change to the producer's state. It works similarly to [`subscribe`](#subscribeselector-predicate-listener), but the listener is automatically unsubscribed after the first call. If the predicate is provided, the listener will only be called if the predicate returns `true`.

To unsubscribe from a listener, call the function returned by `once`.

<Tabs groupId="languages">
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

-   `once` has the [same caveats](#caveats) as [`subscribe`](#subscribeselector-predicate-listener).

-   If the predicate returns `true` at the time of subscription, the listener **will not** be called immediately. It will only be called once the selected state changes, and only if the predicate returns `true` at that time. This behavior is analogous to `Promise.fromEvent` and how it waits for the _next_ event.

:::

---

### `wait(selector, predicate?)`

`wait` returns a promise that resolves once the selected state changes. If the predicate is provided, the promise will only resolve if the predicate returns `true`.

To unsubscribe from a listener, cancel the promise returned by `wait`.

<Tabs groupId="languages">
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

-   `wait` has the [same caveats](#caveats) as [`subscribe`](#subscribeselector-predicate-listener).

-   If the predicate returns `true` at the time `wait` is called, the Promise **will not** resolve immediately. It will only be resolve once the selected state changes, and only if the predicate returns `true` at that time. This behavior is analogous to `Promise.fromEvent` and how it waits for the _next_ event.

:::

---

### `observe(selector, discriminator?, observer)`

`observe` lets you track the addition and removal of a **unique item** in the producer's state. The selector may return an array or a record of items. When an item is added, the Observer is called with the item and the index, and cleaned up when the item is removed.

The **discriminator** is used to differentiate between items. If the discriminator is not provided, the item is tracked by its reference in the record. If the discriminator is provided, the discriminator is called with the item and index and should return a value unique to that item. The item is tracked by this value instead.

To unsubscribe all Observers, call the function returned by `observe`.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectTodos = (state: State) => state.todos;

const identifyTodo = (todo: Todo, index: number) => todo.id;

producer.observe(selectTodos, identifyTodo, (todo, index) => {
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

local function identifyTodo(todo, index)
    return todo.id
end

producer:observe(selectTodos, identifyTodo, function(todo, index)
    print(todo, "was added")

    return function()
        print(todo, "was removed")
    end
end)
```

</TabItem>
</Tabs>

[See more examples below.](#using-the-observer-pattern)

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

### `observeWhile(selector, predicate?, observer)`

`observeWhile` is similar to [`observe`](#observeselector-discriminator-observer), but it creates only one Observer over the time the selector returns a truthy value, and cleans it up when it becomes falsy. This is useful for tracking a specific value or condition in the state.

The `predicate` can be used if you want to specify a certain condition instead of evaluating the truthiness of the selected state. It is called with the current and previous selected state, and should return a boolean indicating whether the Observer should be created.

To unsubscribe the Observer, call the function returned by `observeWhile`.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectStatus = (state: State) => state.status;

const isLoading = (status: string) => status === "loading";

producer.observeWhile(selectStatus, isLoading, (status) => {
	print("loading started");

	return () => {
		print("loading ended");
	};
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectStatus(state)
    return state.status
end

local function isLoading(status)
    return status == "loading"
end

producer:observeWhile(selectStatus, isLoading, function(status)
    print("loading started")

    return function()
        print("loading ended")
    end
end)
```

</TabItem>
</Tabs>

[See more examples below.](#using-the-observer-pattern)

#### Parameters

-   `selector` - A function that selects a part of the state.

-   **optional** `predicate` - A function that determines whether the Observer should be created. If not provided, the Observer is created when the selected state is truthy.

-   `observer` - Called when the selector or predicate returns a truthy value. It returns an optional cleanup function that is called when the value is no longer truthy.

#### Returns

`observeWhile` returns a function that can be called to unsubscribe from the state and clean up the Observer.

:::info Caveats

-   Only one Observer can exist at one time, and it will not be called again until the selector or predicate returns a falsy value and then a truthy value again.

:::

---

### `flush()`

The `flush` method is used to immediately run a scheduled update. This is useful for forcing an update to run synchronously, but should generally be avoided.

<Tabs groupId="languages">
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

<Tabs groupId="languages">
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

Games have a lot of state that changes over time, and you often need to perform _side effects_ for certain state updates. Let's first look at how to subscribe to state changes, and then we'll cover some use cases.

You can use [`subscribe`](#subscribeselector-predicate-listener) to connect a listener function that runs whenever a certain part of the state changes:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectCount = (state: State) => state.count;

producer.subscribe(selectCount, (count) => {
	print("count changed:", count);
});

producer.increment(10); // count changed: 10
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

producer.increment(10) --> count changed: 10
```

</TabItem>
</Tabs>

The listener runs whenever the value given by `selectCount` changes. Once the `increment` action is dispatched, the listener will output the new value of `count` on the next tick.

You pass two parameters to the `subscribe` method:

1.  A _selector_ that returns a subset of the state you want to subscribe to.
2.  The _listener_ to call when the state changes.

Once you have subscribed to the state you want, you can safely run side effects in the listener function. For example, you play a damage sound when a player gets hurt.

**Say you have a game where the player's health is stored in the state:**

<Tabs groupId="languages">
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

type RootActions = {
    takeDamage: (health: number) -> (),
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
}) :: Reflex.Producer<RootState, RootActions>
```

</TabItem>
</Tabs>

Your producer has an action to deal damage to the player, and a `health` field for the player in the state. You now know how to select the `health` field and subscribe to changes, but how can you play a sound when they _lose_ health?

**You can do this by checking if the new health is lower than the previous health:**

<Tabs groupId="languages">
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

**This code calls the `playDamageSound` function whenever the player's health decreases.** If the current health is less than the previous health, the player was hurt, and the sound should play.

But what if you want to wait for a specific state change to occur? [Producers provide methods for that, too!](#waiting-for-state-changes)

---

### Waiting for state changes

Sometimes, you want to delay a side effect until a specific state change occurs. Producers offer the [`once`](#onceselector-predicate-listener) and [`wait`](#waitselector-predicate) methods to help wait for an event to occur.

For example, say your player state also contains a `jumping` boolean that is set to `true` when the player holds down the jump button. You want it to run a `jump()` function in a loop, and disconnect it when it stops. One way to automatically disconnect the loop is with [`once`](#onceselector-predicate-listener).

This code starts the loop when `jumping` is set to `true`, and then disconnects the loop when the state changes to `false`:

<Tabs groupId="languages">
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

<Tabs groupId="languages">
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

### Transforming state with selectors

**A good rule of thumb is to keep your state as simple as possible.** This includes avoiding redundant data that can be derived from other parts of the state. However, that might make it harder to perform side effects on your existing state. How can you derive _new data_ from the state without changing it?

Say your game's state contains a list of players, and each player has a `health` and `id` property. If you want to retrieve a list of players that are alive, you can create a _selector_ that creates a new list of players from the existing state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectPlayers = (state: RootState) => state.players;

const selectAlivePlayers = createSelector(selectPlayers, (players) => {
	return players.filter((player) => player.health > 0);
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectPlayers(state)
    return state.players
end

local selectAlivePlayers = Reflex.createSelector(selectPlayers, function(players)
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

<Tabs groupId="languages">
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

This is where the [`observe`](#observeselector-discriminator-observer) method comes in handy. [See how to use it in the next section.](#using-the-observer-pattern)

---

### Using the observer pattern

**Game state often contains many lists and records of data.** You will likely need to run code when a new item is added to a record, or clean something up when the item is removed. We'll explore Observers, their use cases, and using [`observe`](#observeselector-discriminator-observer).

**[`observe`](#observeselector-discriminator-observer) brings the [Observer pattern](https://sleitnick.github.io/RbxObservers/docs/observer-pattern) to Reflex.** Some good use cases for [`observe`](#observeselector-discriminator-observer) include:

-   Managing matches in a multiplayer game
-   Spawning players and cleaning up when they die or leave the game
-   Applying temporary status effects

Let's say your state has a list of players, and each player has a `health` and `id` property. You want to play a sound whenever a player is damaged or dies. To help track individual players, you should first create a [memoized selector](#transforming-state-with-selectors) that selects a player's health by their ID:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectPlayers = (state: RootState) => state.players;

const selectPlayerById = (id: number) => {
	return createSelector(selectPlayers, (players) => {
		return players.find((player) => player.id === id);
	});
};

// highlight-start
const selectPlayerHealth = (id: number) => {
	return createSelector(selectPlayerById(id), (player) => {
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
    return Reflex.createSelector(selectPlayers, function(players)
        for _, player in players do
            if player.id == id then
                return player
            end
        end
    end)
end

// highlight-start
local function selectPlayerHealth(id)
    return Reflex.createSelector(selectPlayerById(id), function(player)
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

**`selectPlayerById` and `selectPlayerHealth` are [selector factories](create-selector#selector-factories).** Factories are useful when you want to create a reusable selector that is memoized for a specific set of inputs. [See more on why this approach helps with performance](create-selector#passing-input-parameters).

:::

**Now you can subscribe to changes in a specific player's health!** But creating this subscription for new players and unsubscribing when they are removed can be difficult to set up. This is where the [`observe`](#observeselector-discriminator-observer) method comes in handy.

[`observe`](#observeselector-discriminator-observer) takes a **selector**, an optional **discriminator**, and an **Observer**. The selector returns a list or record of items, in which the Observer is called when a unique item is added. The Observer may return a cleanup function that is automatically called when the item is removed from the list.

**The Observer in this code exists throughout the lifetime of each player.** It can subscribe to changes in the player's health, and run side effects when the player is damaged or dies. When the player no longer alive, they are removed from the list, and the cleanup function is called.

<Tabs groupId="languages">
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

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
// highlight-start
const selectPlayerIds = createSelector(selectPlayers, (players) => {
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
local selectPlayerIds = Reflex.createSelector(selectPlayers, function(players)
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

**Middleware is a powerful tool for extending the behavior of producers and actions.** In Reflex, middleware can be used to add logging, cancel actions, add undo/redo functionality, and more.

[See how to create middleware →](middleware#building-middleware)

---

### Using multiple producers

**Reflex is best used with a single producer holding the entire state of your app.** It's also good practice to organize state into different producers, and combine them with [`combineProducers`](combine-producers).

[See `combineProducers` for more details →](combine-producers)
