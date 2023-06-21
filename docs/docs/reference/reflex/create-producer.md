---
sidebar_position: 1
description: Manage your game's state with producers.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# createProducer

`createProducer` lets you create a [producer](producer) that contains a part of your game's state.

```ts
const producer = createProducer(initialState, actions);
```

<TOCInline toc={toc} />

---

## Reference

### `createProducer(initialState, actions)`

Creates a [producer](producer) initialized with the given `initialState` and merged with your `actions`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(0, {
	increment: (state, value: number) => state + value,
	decrement: (state, value: number) => state - value,
	set: (_, value: number) => value,
});
```

</TabItem>
<TabItem value="Luau">

```lua
type Dispatchers = {
    increment: (value: number) -> CounterState,
}

local producer = Reflex.createProducer(0, {
    increment = function(state, value: number): number
        return state + value
    end,
    decrement = function(state, value: number): number
        return state - value
    end,
    set = function(_, value: number): number
        return value
    end,
}) :: Reflex.Producer<number, Dispatchers>
```

</TabItem>
</Tabs>

Actions define how the state should be updated. They are pure functions that receive the current state and some parameters, and return a new state. They can be dispatched through the producer:

```ts
producer.increment(1); // state = 1
```

[See more examples below.](#usage)

#### Parameters

-   `initialState` - The initial state of the producer.
-   `actions` - An object containing action functions.

#### Returns

`createProducer` returns a Reflex [producer](producer) that you can use to dispatch actions and subscribe to state changes.

:::info caveats

-   **State must be immutable.** Instead of mutating any part of the state, actions should return a new state object. Otherwise, the producer won't be able to detect state changes.

-   **Actions should be pure and idempotent.** Ideally, they would not have any side effects, and should always return the same state for the same parameters.

:::

---

## Usage

### Updating state

Producers are the state containers that you can use to dispatch actions and observe state changes. They work with _immutable data_, ensuring safety and predictability when working with state.

Typically, games and applications keep all of their state in a single root producer. This allows them to easily observe and modify any part of the state.

Use `createProducer` to create a producer with an initial state and action functions:

:::info

See libraries like [Sift](https://csqrl.github.io/sift/) and [Immut](https://solarhorizon.github.io/immut/) for utilities that make it easier to work with immutable data.

:::

<Tabs>
<TabItem value="TypeScript" default>

```ts
interface CounterState {
	readonly count: number;
}

const initialState: CounterState = {
	count: 0,
};

const producer = createProducer(initialState, {
	increment: (state, value: number) => ({
		...state,
		count: state.count + value,
	}),
	// ...
});
```

</TabItem>
<TabItem value="Luau">

```lua
type CounterState = {
    count: number,
}

type CounterDispatchers = {
    increment: (value: number) -> CounterState,
    -- ...
}

local initialState: CounterState = {
    count = 0,
}

local producer = Reflex.createProducer(initialState, {
    increment = function(state, value: number): CounterState
        return { count = state.count + value }
    end,
    -- ...
}) :: Reflex.Producer<CounterState, CounterDispatchers>
```

</TabItem>
</Tabs>

`createProducer` returns a producer combined with your action functions. Producers can update their state by dispatching actions:

<Tabs>
<TabItem value="TypeScript" default>

```ts
producer.increment(1);
producer.getState(); // { count: 1 }
```

</TabItem>
<TabItem value="Luau">

```lua
producer.increment(1)
producer:getState() --> { count = 1 }
```

</TabItem>
</Tabs>

---

### Updating nested state

Because state is immutable, updating nested state can be a bit tricky, especially in Luau.

The easiest way to do this is to use a library like [Sift](https://csqrl.github.io/sift/) or [Immut](https://solarhorizon.github.io/immut/) to update nested state, but you can also do it manually:

<Tabs>
<TabItem value="TypeScript" default>

```ts
interface TodoState {
	readonly todos: readonly Todo[];
}

interface Todo {
	readonly text: string;
	readonly completed: boolean;
}

const initialState: CounterState = {
	entries: {},
};

const producer = createProducer(initialState, {
	addTodo: (state, text: string) => ({
		...state,
		todos: [...state.todos, { text, completed: false }],
	}),

	toggleTodo: (state, index: number) => ({
		...state,
		todos: state.todos.map((todo, i) => {
			if (i !== index) {
				return todo;
			}
			return { ...todo, completed: !todo.completed };
		}),
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua
type TodoState = {
    todos: { Todo },
}

type TodoDispatchers = {
    addTodo: (text: string) -> TodoState,
    toggleTodo: (index: number) -> TodoState,
}

type Todo = {
    text: string,
    completed: boolean,
}

local initialState: TodoState = {
    todos = {},
}

local producer = Reflex.createProducer(initialState, {
    addTodo = function(state, test: string): TodoState
        // highlight-start
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)
        // highlight-end

        table.insert(nextTodos, { text = text, completed = false })
        nextState.todos = nextTodos

        return nextState
    end,

    toggleTodo = function(state, index: number): TodoState
        // highlight-start
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)
        local nextTodo = table.clone(state.todos[index])
        // highlight-end

        nextTodo.completed = not nextTodo.completed
        nextTodos[index] = nextTodo
        nextState.todos = nextTodos

        return nextState
    end,
}) :: Reflex.Producer<TodoState, TodoDispatchers>
```

</TabItem>
</Tabs>

---

### Importing and exporting types

Usually, a project will organize its state between multiple producers in separate files, and then combine them into a single producer.

Producer modules should export the type of their state (and dispatchers in Luau). This allows you to use a fully typed root producer that contains all of your actions and state.

:::note

This is not required in TypeScript, since types can be inferred from the producer object.

:::

<Tabs>
<TabItem value="TypeScript" default>

```ts title="counter.ts"
export interface CounterState {
	readonly count: number;
}

const initialState: CounterState = {
	count: 0,
};

export const counterProducer = createProducer(initialState, {
	increment: (state, value: number) => ({
		...state,
		count: state.count + value,
	}),
	// ...
});
```

```ts title="root-producer.ts"
import { InferState } from "@rbxts/reflex";
import { counterProducer } from "./counter";

export type RootProducer = typeof producer;

export type RootState = InferState<RootProducer>;

export const producer = combineProducers({
	counter: counterProducer,
	// ...
});
```

</TabItem>
<TabItem value="Luau">

```lua title="counter.lua"
export type CounterState = {
    count: number,
}

export type CounterDispatchers = {
    increment: (value: number) -> CounterState,
    -- ...
}

local initialState: CounterState = {
    count = 0,
}

local counterProducer = Reflex.createProducer(initialState, {
    increment = function(state, value: number): CounterState
        return { count = state.count + value }
    end,
    -- ...
})

return {
    producer = counterProducer,
}
```

```lua title="init.lua"
local counter = require(script.Parent.counter)
local other = require(script.Parent.other)

export type RootState = {
    counter: counter.CounterState,
    other: other.OtherState,
}

export type RootDispatchers = counter.CounterDispatchers &
    other.OtherDispatchers

export type RootProducer = Reflex.Producer<RootState, RootDispatchers>

return Reflex.combineProducers({
    counter = counter.producer,
    other = other.producer,
}) :: RootProducer
```

</TabItem>
</Tabs>

[Learn more about combining producers](combine-producers)

---

## Troubleshooting

### Actions aren't triggering a state update

If you're dispatching actions, but your state listeners don't run when they should, make sure that your action functions **do not** mutate the state.

Code like this assumes a _mutable_ state object:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(initialState, {
	increment: (state, value: number) => {
		// error-next-line
		state.count += value;
		return state;
	},
});
```

</TabItem>
<TabItem value="Luau">

```lua
local producer = Reflex.createProducer(initialState, {
    increment = function(state, value: number): CounterState
        // error-next-line
        state.count += value
        return state
    end,
})
```

</TabItem>
</Tabs>

This action does not return a new state object. As far as Reflex knows, the new state is equal (`===`) to the old sttae, so it assumes that nothing has changed.

To fix this, apply the changes to a new object and return it:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(initialState, {
	increment: (state, value: number) => ({
		...state,
		count: state.count + value,
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua
local producer = Reflex.createProducer(initialState, {
    increment = function(state, value: number): CounterState
        // highlight-next-line
        local nextState = table.clone(state)
        nextState.count += value
        return nextState
    end,
})
```

</TabItem>
</Tabs>

This action returns a new state object, so Reflex quickly knows that the state has changed and will trigger state listeners.

This problem can also occur with nested state, so make sure your actions never mutate any state!
