import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# createProducer

`createProducer` lets you create a [producer](producer) that contains a part of your game's state.

```ts
const producer = createProducer(initialState, actions);
```

-   [Reference](#reference)
    -   [`createProducer(initialState, actions)`](#createproducerinitialstate-actions)
    -   [`actions` object](#actions-object)
-   [Usage](#usage)
    -   [Updating state](#updating-state)
    -   [Updating nested state](#updating-nested-state)
    -   [Importing and exporting types](#importing-and-exporting-types)
-   [Troubleshooting](#troubleshooting)
    -   [Actions aren't triggering a state update](#actions-arent-triggering-a-state-update)

## Reference

### `createProducer(initialState, actions)`

Creates a [Producer](producer) initialized with the given `initialState` and merged with your `actions`.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(0, {
	increment: (state, value: number) => state + value,
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
}) :: Reflex.Producer<number, Dispatchers>
```

</TabItem>
</Tabs>

#### Parameters

-   `initialState`: The initial state of the producer.
-   `actions`: An object containing action functions.

#### Returns

`createProducer` returns a Reflex producer that you can use to dispatch actions and subscribe to state changes.

### `actions` object

`createProducer` takes an object containing action functions. Actions are pure functions that receive the current state and some parameters, and return a new state.

The producer contains dispatchers that call the action functions and update the state.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(0, {
	increment: (state, value: number) => state + value,
	decrement: (state, value: number) => state - value,
	set: (_, value: number) => value,
	// ...
});

producer.increment(1);
```

</TabItem>
<TabItem value="Luau">

```lua
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
    -- ...
})

producer.increment(1)
```

</TabItem>
</Tabs>

## Usage

### Updating state

Producers allow you to contain your game's state in a single source of truth.

Use `createProducer` to create a producer with a set of actions that update the state.

:::info

State is immutable. Instead of mutating any part of the state, actions should return a new state object.

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
producer:getState() -- { count = 1 }
```

</TabItem>
</Tabs>

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
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)

        table.insert(nextTodos, { text = text, completed = false })
        nextState.todos = nextTodos

        return nextState
    end,

    toggleTodo = function(state, index: number): TodoState
        local nextState = table.clone(state)
        local nextTodos = table.clone(state.todos)
        local nextTodo = table.clone(nextTodos[index])

        nextTodo.completed = not nextTodo.completed
        nextTodos[index] = nextTodo
        nextState.todos = nextTodos

        return nextState
    end,
}) :: Reflex.Producer<TodoState, TodoDispatchers>
```

</TabItem>
</Tabs>

### Importing and exporting types

Usually, a project will organize its state between multiple producers in separate files, and then combine them into a single producer.

Producer modules should export the type of their state (and dispatchers in Luau) so that the root producer can import them.

:::info

This is not required in TypeScript, since types can be inferred from the producer object.

:::

<Tabs>
<TabItem value="TypeScript" default>

```ts
// counter-producer.ts
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

```ts
// root-producer.ts
import { InferState } from "@rbxts/reflex";
import { counterProducer } from "./counter-producer";

export type RootProducer = typeof rootProducer;

export type RootState = InferState<RootProducer>;

export const rootProducer = combineProducers({
	counter: counterProducer,
	// ...
});
```

</TabItem>
<TabItem value="Luau">

```lua
-- counterProducer.lua
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

return Reflex.createProducer(initialState, {
    increment = function(state, value: number): CounterState
        return { count = state.count + value }
    end,
    -- ...
})
```

```lua
-- rootProducer.lua
local counterProducer = require(script.Parent.counterProducer)
local otherProducer = require(script.Parent.otherProducer)

export type RootState = {
    counter: counterProducer.State,
    other: otherProducer.State,
}

export type RootDispatchers = counterProducer.Dispatchers &
    otherProducer.Dispatchers

export type RootProducer = Reflex.Producer<RootState, RootDispatchers>

return Reflex.combineProducers({
    counter = counterProducer,
    other = otherProducer,
}) :: RootProducer
```

</TabItem>
</Tabs>

## Troubleshooting

### Actions aren't triggering a state update

If you're dispatching actions but the state isn't updating, make sure that your action functions are returning a new state object.

Code like this assumes a _mutable_ state object:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const producer = createProducer(initialState, {
	increment: (state, value: number) => {
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
        state.count += value
        return state
    end,
})
```

</TabItem>
</Tabs>

This action does not return a new state object, so the producer assumes that nothing has changed.

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
        local nextState = table.clone(state)
        nextState.count += value
        return nextState
    end,
})
```

</TabItem>
</Tabs>
