---
description: Learn how to structure your Reflex project.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Organizing Producers

Everything you need to read and update your state can be contained within a single producer. However, as your game scales, you might prefer to split up your code into multiple files.

:::note we discuss:

-   🎂 What a root producer is
-   🍰 How to split producers into multiple slices
-   📦 How to export your slices and its types
-   📂 Creating a root producer

:::

---

## The root producer

The root producer is the entry point for your game's state and actions. You'll use it to perform all of your state updates and subscribe to your state.

In the [Your First Producer](your-first-producer#creating-a-producer) guide, we created a producer called `todos`:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="todos.ts"
import { createProducer } from "@rbxts/reflex";

// ...

export const todos = createProducer(initialState, {
	addTodo: (state, todo: string) => ({
		...state,
		todos: [...state.todos, todo],
	}),

	removeTodo: (state, todo: string) => ({
		...state,
		todos: state.todos.filter((t) => t !== todo),
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua title="todos.lua"
local Reflex = require(ReplicatedStorage.Packages.Reflex)

-- ...

local todos = Reflex.createProducer(initialState, {
    addTodo = function(state: TodosState, todo: string): TodosState
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)

        table.insert(nextTodos, todo)
        nextState.todos = nextTodos

        return nextState
    end,

    removeTodo = function(state: TodosState, todo: string): TodosState
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)

        table.remove(nextTodos, table.find(nextTodos, todo) or -1)
        nextState.todos = nextTodos

        return nextState
    end,
}) :: TodosProducer
```

</TabItem>
</Tabs>

**As our game grows, our state grows in complexity.** For example, we might want to add a calendar to track upcoming events. Instead of repurposing our `todos` producer to include the calendar, it would be better to create _slices_.

---

## Defining slices

A _producer slice_ is a subset of your root producer's state and actions. Instead of being used on their own, they are used to [define your root producer](#defining-a-root-producer). By splitting up your producers into slices, you can keep your code organized and easy to maintain.

Here, both `todos` and `calendar` have been made into producer slices:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```text title="File structure"
producer
├── calendar.ts
├── todos.ts
└── index.ts
```

<Tabs>
<TabItem value="Todos">

```ts title="todos.ts" showLineNumbers
import { createProducer } from "@rbxts/reflex";

export interface TodosState {
	readonly todos: readonly string[];
}

const initialState: TodosState = {
	todos: [],
};

export const todosSlice = createProducer(initialState, {
	addTodo: (state, todo: string) => ({
		...state,
		todos: [...state.todos, todo],
	}),

	removeTodo: (state, todo: string) => ({
		...state,
		todos: state.todos.filter((t) => t !== todo),
	}),
});
```

</TabItem>
<TabItem value="Calendar">

```ts title="calendar.ts" showLineNumbers
import { createProducer } from "@rbxts/reflex";

export interface CalendarState {
	readonly events: readonly CalendarEvent[];
}

export interface CalendarEvent {
	readonly name: string;
	readonly date: number;
}

const initialState: CalendarState = {
	events: [],
};

export const calendarSlice = createProducer(initialState, {
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
</Tabs>

</TabItem>
<TabItem value="Luau">

```text title="File structure"
producer
├── calendar.lua
├── todos.lua
└── init.lua
```

<Tabs>
<TabItem value="Todos">

```lua title="todos.lua" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

export type TodosState = {
    todos: { string }
}

export type TodosActions = {
    addTodo: (todo: string) -> (),
    removeTodo: (todo: string) -> (),
}

local initialState: TodosState = {
    todos = {},
}

local todosSlice = Reflex.createProducer(initialState, {
    addTodo = function(state: TodosState, todo: string): TodosState
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)

        table.insert(nextTodos, todo)
        nextState.todos = nextTodos

        return nextState
    end,

    removeTodo = function(state: TodosState, todo: string): TodosState
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)

        table.remove(nextTodos, table.find(nextTodos, todo) or -1)
        nextState.todos = nextTodos

        return nextState
    end,
})

return { todosSlice = todosSlice }
```

</TabItem>
<TabItem value="Calendar">

```lua title="calendar.lua" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

export type CalendarState = {
    events: { CalendarEvent }
}

export type CalendarEvent = {
    name: string,
    date: string,
}

export type CalendarActions = {
    addEvent: (event: CalendarEvent) -> (),
    removeEvent: (event: CalendarEvent) -> (),
}

local initialState: CalendarState = {
    events = {},
}

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

return { calendarSlice = calendarSlice }
```

</TabItem>
</Tabs>

:::info

We export `TodosState` and `TodosActions` to make it easier to type our root producer, since type inference in Luau is not as powerful as TypeScript.

:::

</TabItem>
</Tabs>

Our state has been broken into two slices:

1.  `todosSlice` manages a list of todos.
2.  `calendarSlice` tracks events on a calendar.

These slices can then be **combined** into a root producer.

---

## Defining a root producer

The root producer file is where you'll combine all of your slices into a single producer. This file is the entry point for managing your game's state, and also exports some utility types to help us later. You can combine your slices with [`combineProducers`](../reference/reflex/combine-producers):

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="index.ts" showLineNumbers
import { CombineStates, combineProducers } from "@rbxts/reflex";
import { todosSlice } from "./todos";
import { calendarSlice } from "./calendar";

export type RootProducer = typeof producer;

export type RootState = CombineStates<RootProducer>;

export const producer = combineProducers({
	todos: todosSlice,
	calendar: calendarSlice,
});
```

</TabItem>
<TabItem value="Luau">

```lua title="init.lua" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)
local todos = require(script.todos)
local calendar = require(script.calendar)

export type RootProducer = Reflex.Producer<RootState, RootActions>

export type RootState = {
    todos: todos.TodosState,
    calendar: calendar.CalendarState,
}

type RootActions = todos.TodosActions & calendar.CalendarActions

return Reflex.combineProducers({
    todos = todos.todosSlice,
    calendar = calendar.calendarSlice,
}) :: RootProducer
```

</TabItem>
</Tabs>

Now that we have a root producer, we can use the state and actions from our slices. Calling [`combineProducers`](../reference/reflex/combine-producers) does three things:

1.  **Combine** the state from each slice using the shape you provided.
2.  **Expose** the actions from each slice under the root producer.
3.  **Merge** any actions that have the same name.

With this, we can now access all of our state and actions from the root producer.

### Using the root producer

As mentioned above, combining slices into a root producer exposes the actions from each slice under the root producer. This means that we can call the todo list's `addTodo` and `removeTodo` from the root producer, and it will update the state of `todos`:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="example.ts" showLineNumbers
import { RootState, producer } from "./producer";

const selectTodos = (state: RootState) => state.todos.todos;

producer.subscribe(selectTodos, (todos) => {
	print(`TODO: ${todos.join(", ")}`);
});

producer.addTodo("Buy milk");
producer.addTodo("Buy eggs");
```

</TabItem>
<TabItem value="Luau">

```lua title="example.lua" showLineNumbers
local producer = require(script.Parent.producer)

local function selectTodos(state: producer.RootState)
    return state.todos.todos
end

producer:subscribe(selectTodos, function(todos)
    print("TODO: " .. table.concat(todos, ", "))
end)

producer.addTodo("Buy milk")
producer.addTodo("Buy eggs")
```

</TabItem>
</Tabs>

```bash
# TODO: Buy milk, Buy eggs
```

Or, we can call the calendar's `addEvent` and `removeEvent` from the root producer, and it will update the state of `calendar`:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="example.ts" showLineNumbers
import { RootState, producer } from "./producer";

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

```lua title="example.lua" showLineNumbers
local producer = require(script.Parent.producer)

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

:::caution

**You should only call actions from the root producer.** Calling actions from a slice will not update the state of the root producer, and vice versa.

:::

---

## Summary

-   The root producer is the **entry point** for your game's state.
-   Your actions and state are exposed under the root producer.
-   You can use **slices** to break up your state into smaller pieces.
-   You can **combine slices** into a root producer with [`combineProducers`](../reference/reflex/combine-producers).
