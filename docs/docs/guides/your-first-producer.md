---
description: Learn how to write a producer in Reflex.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Your First Producer

_Producers_ are the building blocks of Reflex. They are the state containers that hold your state and actions, and you can use them to read and subscribe to your state.

:::note what you'll learn

-   🔍 What a producer is
-   ✨ How to create a producer
-   🛠️ How to use your producer

:::

---

## What is a producer?

A [producer](../reference/reflex/producer) is a state container that you can use to dispatch actions or observe state changes. They're designed to be used as a single source of truth for your state, and provide an all-in-one interface for managing your game's state.

Where [Rodux](https://roblox.github.io/) uses a reducer to return the next state of a store, Reflex has actions that return the next state of the producer. Reflex aims to be quick to set up and easy to use, so creating a producer is simple and straightforward.

---

## Creating a producer

Traditionally, [Rodux](https://roblox.github.io/rodux) uses a reducer function that takes in an action and returns a new state. Reflex takes a slightly different approach and allows the actions themselves to update the state. Here's what a producer might look like:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts title="todos.ts" showLineNumbers
import { createProducer } from "@rbxts/reflex";

export interface TodosState {
	readonly todos: readonly string[];
}

const initialState: TodosState = {
	todos: [],
};

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

```lua title="todos.lua" showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

export type TodosProducer = Reflex.Producer<TodosState, TodosActions>

export type TodosState = {
    todos: { string },
}

export type TodosActions = {
    addTodo: (todo: string) -> (),
    removeTodo: (todo: string) -> (),
}

local initialState: TodosState = {
    todos = {},
}

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

return todos
```

</TabItem>
</Tabs>

A producer consists of:

### State

The **state** is the data that your producer holds. It's the source of truth for your game or app, and can only be modified by your actions. In the example above, the state is an object with a `todos` property, which is an array of strings.

You've probably noticed that the state is marked as `readonly`. This is because Reflex is an [immutable](https://en.wikipedia.org/wiki/Immutable_object) state container. You can't write to the state directly, and instead must return a new state from your actions.

### Actions

**Actions** are functions that modify your state. They should be _idempotent_, meaning that they should always return the same result when given the same arguments. In the example above, `addTodo` and `removeTodo` are actions that modify the `todos` property of the state.

To add a todo to the list, you would simply run `todos.addTodo(name)`. Note that these are not methods, so you shouldn't use the `:` operator to call them in Luau.

---

## Using a producer

Now that you've created a producer, you're free to read and modify its state. For example, you can print the list of todos whenever it changes:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
import { TodosState, todos } from "./todos";

const selectTodos = (state: TodosState) => state.todos;

todos.subscribe(selectTodos, (todos) => {
	print(`TODO: ${todos.join(", ")}`);
});

todos.addTodo("Buy milk");
todos.addTodo("Buy eggs");
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
local todos = require(script.Parent.todos)

local function selectTodos(state: todos.TodosState)
    return state.todos
end

todos:subscribe(selectTodos, function(todos)
    print("TODO: " .. table.concat(todos, ", "))
end)

todos.addTodo("Buy milk")
todos.addTodo("Buy eggs")
```

</TabItem>
</Tabs>

```lua
--> TODO: Buy milk, Buy eggs
```

This example [subscribes](../reference/reflex/producer#subscribeselector-predicate-listener) to changes in `state.todos` and prints the list of todos whenever it changes. After adding `Buy milk` and `Buy eggs` to the list, it prints the updated list.

### Organizing producers

Reflex is designed to have one root producer be the **single source of truth** for your state. This producer can be composed of smaller slices that handle different parts of your state.

For example, you could have a `calendar` producer that stores important dates, and a `todos` producer that handles the list of todos. You will learn more about this in the [next guide](organizing-producers).

---

## Summary

-   **Producers** are state containers that hold your state and actions.
-   **Actions** are functions that modify your state.
-   **State** is the immutable data that your producer holds.
-   You can **subscribe** to changes in your state using `subscribe`.
-   The producer exposes your actions as callbacks, which you can call to change the state.
