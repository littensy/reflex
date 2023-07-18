---
description: Get started with the basics of using Reflex.
slug: /
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Quick Start

_Reflex_ is a lightweight state management library that lets you write simple and predictable code to manage state throughout your Roblox game. It is based on the [Silo](https://github.com/Sleitnick/rbxts-silo) library and is inspired by [Redux](https://redux.js.org/).

## Installation

Reflex is available on [npm](https://www.npmjs.com/package/@rbxts/reflex) and [Wally](https://wally.run/package/littensy/reflex):

<Tabs>
<TabItem value="npm" default>

```bash title="Terminal"
npm install @rbxts/reflex
```

</TabItem>
<TabItem value="Yarn">

```bash title="Terminal"
yarn add @rbxts/reflex
```

</TabItem>
<TabItem value="pnpm">

```bash title="Terminal"
pnpm add @rbxts/reflex
```

</TabItem>
<TabItem value="Wally">

```toml title="wally.toml"
[dependencies]
Reflex = "littensy/reflex@4.1.0"
```

</TabItem>
</Tabs>

## Start using Reflex

You're now ready to use Reflex! Where Rodux uses stores, reducers, and actions, Reflex revolves around **actions** and [**producers**](./reference/reflex/producer). Create a producer with an initial state and a set of actions, and you're ready to go.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
import { createProducer } from "@rbxts/reflex";

interface State {
	count: number;
}

const initialState: State = {
	count: 0,
};

const producer = createProducer(initialState, {
	increment: (state) => ({ ...state, count: state.count + 1 }),
	reset: (state) => ({ ...state, count: 0 }),
});
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
local Reflex = require(ReplicatedStorage.Packages.Reflex)

type Producer = Reflex.Producer<State, Actions>

type State = {
    count: number,
}

type Actions = {
    increment: () -> (),
    reset: () -> (),
}

local initialState: State = {
    count = 0,
}

local producer = Reflex.createProducer(initialState, {
    increment = function(state: State): State
        return { count = state.count + 1 }
    end,
    reset = function(): State
        return { count = 0 }
    end,
}) :: Producer
```

</TabItem>
</Tabs>

## Use your producer anywhere

Reflex was designed to make managing your state simple and straightforward. Dispatch actions by calling the action directly, and read & subscribe to state with selectors.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts showLineNumbers
producer.subscribe(
	(state) => state.count,
	(count) => {
		print(`The count is now ${count}`);
	},
);

producer.increment(); // The count is now 1
```

</TabItem>
<TabItem value="Luau">

```lua showLineNumbers
producer:subscribe(function(state)
    return state.count
end, function(count)
    print("The count is now " .. count)
end)

producer.increment() --> The count is now 1
```

</TabItem>
</Tabs>
