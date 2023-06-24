---
sidebar_position: 3
description: Learn how to dispatch actions and run side effects in Reflex.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Using Selectors

Games often have complex interactions between different parts of the state. Producers let you subscribe to state changes with _selectors_.

:::note we discuss:

-   ⚡️ How to write actions
-   🔭 How to run side effects
-   🍰 How to write selectors
-   🔐 When to memoize selectors
-   🔥 How to write more powerful selectors

:::

---

## Immutable state and actions

You learned that producers are **immutable** state containers, so state changes are made by dispatching _actions_ that output a new state object. When you want an action to update the state, you apply the changes to new objects instead of mutating the existing state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const calendarSlice = createProducer(initialState, {
	addEvent: (state, event: CalendarEvent) => ({
		...state,
		events: [...state.events, event],
	}),

	removeEvent: (state, name: string) => ({
		...state,
		events: state.events.filter((e) => e.name !== name),
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

    removeEvent = function(state: CalendarState, name: string): CalendarState
        local nextState = table.clone(state)
        local nextEvents: { CalendarEvent } = {}

        for _, event in state.events do
            if event.name ~= name then
                table.insert(nextEvents, event)
            end
        end

        nextState.events = nextEvents

        return nextState
    end,
})
```

</TabItem>
</Tabs>

Actions can then be dispatched through the root producer to update the state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectEvents = (state: RootState) => state.calendar.events;

producer.subscribe(selectEvents, (events) => {
	print("EVENTS:");
	for (const event of events) {
		print(`- ${event.name} (${event.date})`);
	}
});

producer.addEvent({ name: "Birthday", date: "2004-12-27" });
producer.addEvent({ name: "Learn Reflex", date: "2023-03-17" });
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectEvents(state: producer.RootState)
    return state.calendar.events
end

producer:subscribe(selectEvents, function(events)
    print("EVENTS:")
    for _, event in events do
        print("- " .. event.name .. " (" .. event.date .. ")")
    end
end)

producer.addEvent({ name = "Birthday", date = "2004-12-27" })
producer.addEvent({ name = "Learn Reflex", date = "2023-03-17" })
```

</TabItem>
</Tabs>

```bash
# EVENTS:
# - Birthday (2004-12-27)
# - Learn Reflex (2023-03-17)
```

We've been using selectors like `selectEvents` and the [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener) method, but we haven't talked about how they work yet. Let's take a look at how selectors work in Reflex.

---

## Selecting state

_Selectors_ are functions that take the root state and return a subset of it. They can be as simple as indexing a property, or as complex as filtering and transforming data. Selectors are used to subscribe to state changes, and to read state in side effects.

In the previous examples, the `selectEvents` selector is simple and returns the `events` property of the calendar slice. But what if you want to get the events sorted by date? You could move that logic to a reusable selector:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectEventsByTime = (state: RootState) => {
	// error-next-line
	return [...state.calendar.events].sort((a, b) => {
		const timeA = DateTime.fromIsoDate(a.date);
		const timeB = DateTime.fromIsoDate(b.date);
		return timeA.UnixTimestamp < timeB.UnixTimestamp;
	});
};

producer.addEvent({ name: "Birthday", date: "2004-12-27" });
producer.addEvent({ name: "Learn Reflex", date: "2023-03-17" });

for (const date of producer.getState(selectEventsByTime)) {
	print(`${date.date} - ${date.name}`);
}
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectEventsByTime(state: producer.RootState)
    // error-next-line
    local events = table.clone(state.calendar.events)

    table.sort(events, function(a, b)
        local timeA = DateTime.fromIsoDate(a.date)
        local timeB = DateTime.fromIsoDate(b.date)
        return timeA.UnixTimestamp < timeB.UnixTimestamp
    end)

    return events
end

producer.addEvent({ name = "Birthday", date = "2004-12-27" })
producer.addEvent({ name = "Learn Reflex", date = "2023-03-17" })

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

This works, and you now have a selector that returns the events sorted by date!

**But there's a catch**: every time you call `selectEventsByTime`, it will create a new array. This can cause problems when you try to [`subscribe`](../reference/reflex/producer#subscribeselector-predicate-listener) to the selector:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.subscribe(selectEventsByTime, (events) => {
	print("EVENTS:");
	for (const event of events) {
		print(`- ${event.name} (${event.date})`);
	}
});

// highlight-next-line
producer.addTodo("Unrelated todo");
```

</TabItem>
<TabItem value="Luau">

```lua
producer:subscribe(selectEventsByTime, function(events)
    print("EVENTS:")
    for _, event in events do
        print("- " .. event.name .. " (" .. event.date .. ")")
    end
end)

// highlight-next-line
producer.addTodo("Unrelated todo")
```

</TabItem>
</Tabs>

```bash
# error-next-line
# EVENTS:
```

Oh no! We added a **todo item**, which is in a different slice of the state, but the listener still ran and tried to print the events. Normally, this listener **shouldn't run** because the events did not change. This is because of how Reflex detects state updates.

### Transforming state

When you create a subscription, Reflex will call the selector function and store the result. Then, when the state changes, Reflex will call the selector again and compare the result to the previous result. If the results are not **equal (`===`)**, the listener will be called with the new result.

Right now, our `selectEventsByTime` creates a new array **every time** it is called. This means that the result will never be equal to the previous result, and the listener will always be called. But if we also can't sort the original array because [state is immutable](#immutable-state-and-actions), what can we do to transform state?

_Memoization_ is a technique that can be used to **cache** the result of a function. If the function is called with the same arguments, the cached result can be returned instead of recalculating it. Reflex exports the [`createSelector`](../reference/reflex/create-selector) function to create memoized selectors:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createSelector } from "@rbxts/reflex";

const selectEvents = (state: RootState) => state.calendar.events;

// highlight-next-line
const selectEventsByTime = createSelector([selectEvents] as const, (events) => {
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
local selectEventsByTime = Reflex.createSelector({ selectEvents }, function(events)
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

**You'd call [`createSelector`](../reference/reflex/create-selector) with two arguments:**

1. `dependencies`, an array of selectors that the `combiner` depends on
2. `combiner`, a function that takes the results of the `dependencies` and returns a new state

The `combiner` won't run unless the dependencies or arguments change, so it's safer to do expensive operations and return new objects in it.

[Read more about `createSelector` →](../reference/reflex/create-selector)

:::

With our new **memoized** selector, the listener will only be called when the `events` dependency changes:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.subscribe(selectEventsByTime, (events) => {
	print("EVENTS:");
	for (const event of events) {
		print(`- ${event.name} (${event.date})`);
	}
});

producer.addTodo("Unrelated todo");

task.wait(1);

producer.addEvent({ name: "Learn Reflex", date: "2023-03-17" });
producer.addEvent({ name: "Birthday", date: "2004-12-27" });
```

</TabItem>
<TabItem value="Luau">

```lua
producer:subscribe(selectEventsByTime, function(events)
    print("EVENTS:")
    for _, event in events do
        print("- " .. event.name .. " (" .. event.date .. ")")
    end
end)

producer.addTodo("Unrelated todo")

task.wait(1)

producer.addEvent({ name = "Learn Reflex", date = "2023-03-17" })
producer.addEvent({ name = "Birthday", date = "2004-12-27" })
```

</TabItem>
</Tabs>

```bash
# EVENTS:
# - Birthday (2004-12-27)
# - Learn Reflex (2023-03-17)
```

Now, we can subscribe to an automatically-sorted list of events efficiently!

Using selectors this way allows you to [derive new information](../reference/reflex/create-selector#transforming-state) from state while keeping your producers and slices simple. This is a common pattern in Rodux applications, and it's a good idea to use it in Reflex too.

:::tip

**Memoizing selectors is a good idea, but it's not always necessary.** You should prefer to memoize selectors that are expensive or return new objects; indexing a table or returning a primitive value is cheap and doesn't need to be memoized.

:::

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
	return createSelector([selectEvents] as const, (events) => {
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
    return Reflex.createSelector({ selectEvents }, function(events)
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

### Stateful selectors

[Selector factories](#passing-arguments-to-selectors) are great for creating selectors that depend on external arguments, but they have the added benefit that the selectors you create are **unique**. You can add variables and logic that are only accessible to a specific selector, which can be used for a variety of cases:

-   Memoizing results with a custom equality function, like shallow equality
-   Storing a cache of previous results
-   Tracking the addition and removal of entities

Let's create a selector that further memoizes the combiner of `selectEventsByTime` with a custom equality function:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const selectEventsByTime = () => {
	let lastEvents: CalendarEvent[] = [];
	let lastResult: CalendarEvent[] = [];

	return createSelector([selectEvents] as const, (events) => {
		// highlight-start
		if (shallowEqual(events, lastEvents)) {
			return lastResult;
		}
		// highlight-end

		lastEvents = events;

		lastResult = [...events].sort((a, b) => {
			const timeA = DateTime.fromIsoDate(a.date);
			const timeB = DateTime.fromIsoDate(b.date);
			return timeA.UnixTimestamp < timeB.UnixTimestamp;
		});

		return lastResult;
	});
};
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectEventsByTime()
    local lastEvents: { calendar.CalendarEvent } = {}
    local lastResult: { calendar.CalendarEvent } = {}

    return Reflex.createSelector({ selectEvents }, function(events)
        // highlight-start
        if shallowEqual(events, lastEvents) then
            return lastResult
        end
        // highlight-end

        lastEvents = events
        lastResult = table.create(events)

        table.sort(lastResult, function(a, b)
            local timeA = DateTime.fromIsoDate(a.date)
            local timeB = DateTime.fromIsoDate(b.date)
            return timeA.UnixTimestamp < timeB.UnixTimestamp
        end)

        return lastResult
    end)
end
```

</TabItem>
</Tabs>

Now, using this selector will only call the listener when the events change **and** the events are not shallowly equal to the previous events:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.addEvent({ name: "Learn Reflex", date: "2023-03-17" });
producer.addEvent({ name: "Birthday", date: "2004-12-27" });

producer.subscribe(selectEventsByTime(), (events) => {
	print("EVENTS:");
	for (const event of events) {
		print(`- ${event.name} (${event.date})`);
	}
});

// highlight-next-line
producer.removeEvent("This event doesn't exist");
```

</TabItem>
<TabItem value="Luau">

```lua
producer.addEvent({ name = "Learn Reflex", date = "2023-03-17" })
producer.addEvent({ name = "Birthday", date = "2004-12-27" })

producer:subscribe(selectEventsByTime(), function(events)
    print("EVENTS:")
    for _, event in events do
        print("- " .. event.name .. " (" .. event.date .. ")")
    end
end)

// highlight-next-line
producer.removeEvent("This event doesn't exist")
```

</TabItem>
</Tabs>

```bash
# ✅ No output
```

Normally, the listener would be called when removing an event that doesn't exist. This makes sense if you check the [implementation of `removeEvent`](#immutable-state-and-actions), as the `events` property is updated to a new array regardless of whether an event was removed.

Because we're using a custom `shallowEquality` function to filter out these false triggers, the listener is not called. You can also write your own utility functions to apply custom logic like this to your selectors.

---

## Summary

-   You can update the state of a producer by calling **actions**.
-   You can **subscribe** to a producer to listen for state changes.
-   You can create **selectors** to select a subset of the state and listen for changes.
-   **Memoizing** selectors can improve performance and reduce redundant updates.
-   **Selector factories** can be used to create selectors that depend on external arguments.
-   Selector factories can hold their own **state**.
