---
description: Learn how to dispatch actions and run side effects in Reflex.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Using Selectors

Games often have complex interactions between different parts of the state. Producers let you subscribe to state changes with _selectors_.

:::note what you'll learn

-   🍰 How to write selectors
-   🔐 When to memoize selectors
-   🔥 How to write more powerful selectors

:::

## Selecting state

_Selectors_ are functions that take the root state and return a subset of it. They can be as simple as indexing a property, or as complex as filtering and transforming data. We'll go over some examples of selectors, and different ways to use them.

Let's say we had this `calendar` slice in our root state, and we wanted to print out all the events in the calendar:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const calendarSlice = createProducer(initialState, {
	addEvent: (state, event: CalendarEvent) => ({
		...state,
		events: [...state.events, event],
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua
local calendarSlice = Reflex.createProducer(initialState, {
    addEvent = function(state: CalendarState, event: CalendarEvent): CalendarState
        local nextState = table.clone(state)
        local nextEvents = table.clone(state.events)

        table.insert(nextEvents, event)
        nextState.events = nextEvents

        return nextState
    end,
})
```

</TabItem>
</Tabs>

With **selectors**, we can write a function that returns the events from the calendar, and use it to get the events from the root state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectEvents = (state: RootState) => {
	return state.calendar.events;
};

for (const event of producer.getState(selectEvents)) {
	print(`${event.name} (${event.date})`);
}
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectEvents(state: producer.RootState)
    return state.calendar.events
end

for _, event in producer:getState(selectEvents) do
    print("- " .. event.name .. " (" .. event.date .. ")")
end
```

</TabItem>
</Tabs>

```bash
# Birthday (2004-12-27)
# Learn Reflex (2023-03-17)
```

Or, if you want to run code when the selector's value changes, you can [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener) to it:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.subscribe(selectEvents, (events) => {
	for (const event of events) {
		print(`${event.name} (${event.date})`);
	}
});
```

</TabItem>
<TabItem value="Luau">

```lua
producer:subscribe(selectEvents, function(events)
    for _, event in events do
        print("- " .. event.name .. " (" .. event.date .. ")")
    end
end)
```

</TabItem>
</Tabs>

### Pitfall: creating objects in selectors

In the previous examples, the `selectEvents` selector is simple and returns the `events` property of the calendar slice. But what if you want to get the events sorted by date? Your first thought might be to write a selector like this:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectEventsByTime = (state: RootState) => {
	// error-next-line
	// 🔴 This creates a new array every time the selector is called
	// error-next-line
	return table.clone(state.calendar.events).sort((a, b) => {
		const timeA = DateTime.fromIsoDate(a.date);
		const timeB = DateTime.fromIsoDate(b.date);
		return timeA.UnixTimestamp < timeB.UnixTimestamp;
	});
};

for (const date of producer.getState(selectEventsByTime)) {
	print(`${date.date} - ${date.name}`);
}
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectEventsByTime(state: producer.RootState)
    // error-next-line
    -- 🔴 This creates a new array every time the selector is called
    // error-next-line
    local events = table.clone(state.calendar.events)

    table.sort(events, function(a, b)
        local timeA = DateTime.fromIsoDate(a.date)
        local timeB = DateTime.fromIsoDate(b.date)
        return timeA.UnixTimestamp < timeB.UnixTimestamp
    end)

    return events
end

for _, date in producer:getState(selectEventsByTime) do
    print(date.date .. " - " .. date.name)
end
```

</TabItem>
</Tabs>

```bash
# 2004-12-27 - Birthday
# 2023-03-17 - Learn Reflex
```

**This code works, but there's a catch.** Every time you call `selectEventsByTime`, it will create a new array! And by returning a new value that isn't equal to the last one, you're telling Reflex that the value changed, even if it has the same contents. This can cause problems when you try to [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener) to the selector:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.subscribe(selectEventsByTime, (events) => {
	print("events changed!");
});

// highlight-next-line
producer.addTodo("Unrelated todo");
```

</TabItem>
<TabItem value="Luau">

```lua
producer:subscribe(selectEventsByTime, function(events)
    print("events changed!")
end)

// highlight-next-line
producer.addTodo("Unrelated todo")
```

</TabItem>
</Tabs>

```bash
# error-next-line
# events changed!
```

Oh no! We added a **todo item**, which is in an unrelated part of the state, but it still thinks that our sorted events changed! We'll go over how to fix this in the [next section](#transforming-state).

---

## Transforming state

Right now, our `selectEventsByTime` selector creates a new array **every time** it is called. This is a problem because Reflex runs our selector on _every_ state change, and detects state updates by **strict equality** (`===`). If the selector's new value is different from what it returned last time, it will call the listener.

But if we also can't sort the original array because [state is immutable](#immutable-state-and-actions), what can we do to transform state?

### Memoization

_Memoization_ is a technique that can be used to **cache** the result of a function. If the function is called with the same arguments, the cached result can be returned instead of recalculating it.

If we memoize our `selectEventsByTime` selector, it will only create a new array when the `events` property changes, fixing the problem we had before.

Reflex exports the [`createSelector`](../reference/reflex/create-selector) function to create memoized selectors:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createSelector } from "@rbxts/reflex";

const selectEvents = (state: RootState) => state.calendar.events;

// highlight-next-line
const selectEventsByTime = createSelector(selectEvents, (events) => {
	return [...events].sort((a, b) => {
		const timeA = DateTime.fromIsoDate(a.date);
		const timeB = DateTime.fromIsoDate(b.date);
		return timeA.UnixTimestamp < timeB.UnixTimestamp;
	});
});
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local function selectEvents(state: producer.RootState)
    return state.calendar.events
end

// highlight-next-line
local selectEventsByTime = Reflex.createSelector(selectEvents, function(events)
    local events = table.clone(events)

    table.sort(events, function(a, b)
        local timeA = DateTime.fromIsoDate(a.date)
        local timeB = DateTime.fromIsoDate(b.date)
        return timeA.UnixTimestamp < timeB.UnixTimestamp
    end)

    return events
end)
```

</TabItem>
</Tabs>

:::tip

**You'd pass two type of values to [`createSelector`](../reference/reflex/create-selector):**

1. `dependencies`, the selectors whose results will be passed to the `combiner`
2. `combiner`, a function that takes the results of the `dependencies` and returns a new state

The `combiner` won't run unless the dependencies and arguments change, so it's safer to do expensive operations and return new objects in it.

[Read more about `createSelector` →](../reference/reflex/create-selector)

:::

With our new **memoized** selector, the listener will only be called when the `events` dependency changes:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.subscribe(selectEventsByTime, (events) => {
	print("events changed!");
});

// ✅ Will not call the listener
producer.addTodo("Unrelated todo");

task.wait(1);

producer.addEvent({ name: "Learn Reflex", date: "2023-03-17" });
```

</TabItem>
<TabItem value="Luau">

```lua
producer:subscribe(selectEventsByTime, function(events)
    print("events changed!")
end)

-- ✅ Will not call the listener
producer.addTodo("Unrelated todo")

task.wait(1)

producer.addEvent({ name = "Learn Reflex", date = "2023-03-17" })
```

</TabItem>
</Tabs>

```bash
# events changed!
```

Now, we can subscribe to an automatically-sorted list of events efficiently!

Using selectors this way allows you to [derive new information](../reference/reflex/create-selector#transforming-state) from state while keeping your producers and slices simple. This is a common pattern when using Rodux, and it's a good idea to use it in Reflex too.

:::tip

**Memoizing selectors is a good idea, but it's not always necessary.** You should prefer to memoize selectors that are expensive or return new objects; indexing a table or returning a primitive value is cheap and doesn't need to be memoized.

:::

---

## Recipes

### Passing arguments to selectors

Often, you may want to pass arguments to a selector. For example, you may want to select a specific calendar event by its name. There are two main ways to do this:

1. [Selector factories](../reference/reflex/create-selector#selector-factories) that return a selector function for a given set of arguments
2. [Currying](../reference/reflex/create-selector#dependency-currying) arguments by adding them to the `dependencies` array

There are pros and cons to each approach, but we'll only cover selector factories because they're more ergonomic.

Let's create a **selector factory** that returns a selector function for a given event name:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createSelector } from "@rbxts/reflex";

const selectEvents = (state: RootState) => state.calendar.events;

// highlight-next-line
const selectEventByName = (name: string) => {
	return createSelector(selectEvents, (events) => {
		return events.find((event) => event.name === name);
	});
};
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local function selectEvents(state: producer.RootState)
    return state.calendar.events
end

// highlight-next-line
local function selectEventByName(name: string)
    return Reflex.createSelector(selectEvents, function(events)
        for _, event in events do
            if event.name == name then
                return event
            end
        end
    end)
end
```

</TabItem>
</Tabs>

With our new selector factory, we can create a selector for a specific event:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
// highlight-next-line
const selectBirthday = selectEventByName("Birthday");

producer.subscribe(selectBirthday, (event) => {
	print(`Birthday is on ${event.date}`);
});

producer.addEvent({ name: "Birthday", date: "2004-12-27" });
```

</TabItem>
<TabItem value="Luau">

```lua
// highlight-next-line
local selectBirthday = selectEventByName("Birthday")

producer:subscribe(selectBirthday, function(event)
    print("Birthday is on " .. event.date)
end)

producer.addEvent({ name = "Birthday", date = "2004-12-27" })
```

</TabItem>
</Tabs>

```bash
# Birthday is on 2004-12-27
```

Selector factories are a nice and simple way to create selectors specialized for a given set of arguments. This pattern can be used to create selectors for a specific user, apply a sort filter, or any other transformation that depends on external arguments.

### Custom equality checks

By default, [`createSelector`](../reference/reflex/create-selector) uses a strict equality check to compare the results of the dependencies and determine whether to call the `combiner`. This is usually fine, but sometimes you may want to use a custom equality check.

#### Equality of dependencies

[`createSelector`](../reference/reflex/create-selector) accepts an optional third argument, `options`, which can be used to customize the behavior of the selector. One of the options is `equalityCheck`, which can be used to specify a custom equality check.

For example, if you want to only run the `combiner` if the dependencies are not shallowly equal, you can use `shallowEqual` as the `equalityCheck`:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createSelector, shallowEqual } from "@rbxts/reflex";

const selectTodos = createSelector(
	selectTodoIds,
	(ids) => {
		for (const _ of $range(0, 10000)) {
			// some expensive operation
		}
	},
	// highlight-next-line
	{ equalityCheck: shallowEqual },
);

selectTodos(table.clone(state)) === selectTodos(table.clone(state)); // true
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local selectTodos = Reflex.createSelector(selectTodoIds, function(ids)
    for i = 1, 10000 do
        -- some expensive operation
    end
end, {
    // highlight-next-line
    equalityCheck = Reflex.shallowEqual,
})

selectTodos(table.clone(state)) == selectTodos(table.clone(state)) -- true
```

</TabItem>
</Tabs>

#### Equality of results

[`createSelector`](../reference/reflex/create-selector)'s `options` argument also accepts a `resultEqualityCheck` option, which is used to prevent returning a new value unless the result is not "equal" to the previous value. This is useful when the `combiner` returns a new object every time it's called, but the result is actually the same.

For example, if you want to only return a new object if the `todos` array has changed, you can use `shallowEqual` as the `resultEqualityCheck`:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createSelector, shallowEqual } from "@rbxts/reflex";

const selectTodoIds = createSelector(
	selectTodos,
	(todos) => {
		return todos.map((todo) => todo.id);
	},
	// highlight-next-line
	{ resultEqualityCheck: shallowEqual },
);

selectTodos(table.clone(state)) === selectTodos(table.clone(state)); // true
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local selectTodoIds = Reflex.createSelector(selectTodos, function(todos)
    local ids = {}

    for _, todo in todos do
        table.insert(ids, todo.id)
    end

    return ids
end, {
    // highlight-next-line
    resultEqualityCheck = Reflex.shallowEqual,
})

selectTodos(table.clone(state)) == selectTodos(table.clone(state)) -- true
```

</TabItem>
</Tabs>

---

## Summary

-   You can update the state of a producer by calling **actions**.
-   You can **subscribe** to a producer to listen for state changes.
-   You can create **selectors** to select a subset of the state and listen for changes.
-   **Memoizing** selectors can improve performance and reduce redundant updates.
-   **Selector factories** can be used to create selectors that depend on external arguments.
-   Selector factories can hold their own **state**.
