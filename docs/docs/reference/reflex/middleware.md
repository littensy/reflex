---
sidebar_position: 5
description: Middleware functions provided by Reflex.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# Middleware

_Middleware_ lets you enhance the behavior of your producers and actions. You can either use the built-in middleware or write your own.

<TOCInline toc={toc} />

---

## Built-in middleware

### `loggerMiddleware`

Logs all actions, their payloads, and the new state to the output.

<Tabs>
<TabItem value="TypeScript" default>

```ts
import { createProducer, loggerMiddleware } from "@rbxts/reflex";

const producer = createProducer(0, {
	increment: (state, amount: number) => state + amount,
});

producer.applyMiddleware(loggerMiddleware);
producer.increment(1);

// Output:
// [Reflex] Mounted with state 0
// [Reflex] Dispatching increment(1)
// [Reflex] State changed to 1
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.reflex)

local producer = Reflex.createProducer(0, {
    increment = function(state, amount: number)
        return state + amount
    end,
})

producer:applyMiddleware(Reflex.loggerMiddleware)
producer.increment(1)

-- Output:
-- [Reflex] Mounted with state 0
-- [Reflex] Dispatching increment(1)
-- [Reflex] State changed to 1
```

</TabItem>
</Tabs>

---

## Building middleware

### Your first middleware

**Middleware is a powerful tool for extending the behavior of producers and actions.** In Reflex, middleware can be used to add logging, cancel actions, add undo/redo functionality, and more.

Middlewares are essentially a chain of functions that wrap around actions and producers. They are called in the order they are applied, and can be used to perform side effects or modify the arguments and return values of actions.

They sound complicated, but can become straightforward when observing how they work in practice.

**This example is a custom implementation of `loggerMiddleware`:**

<Tabs>
<TabItem value="TypeScript" default>

```ts
const loggerMiddleware: ProducerMiddleware = (producer) => {
	// Producer-level, called by applyMiddleware

	producer.subscribe((state) => {
		print("state changed to", state);
	});

	return (dispatch, name) => {
		// Action-level, called per action function

		return (...args) => {
			// Dispatch-level, wraps around action dispatch

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
    -- Producer-level, called by applyMiddleware

    producer:subscribe(function(state)
        print("state changed to", state)
    end)

    return function(dispatch, name)
        -- Action-level, called per action function

        return function(...)
            -- Dispatch-level, wraps around action dispatch

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

**The third level of middleware acts as a wrapper for actions.** Calling `dispatch` will invoke the next middleware in the chain, or the original action if it is the last middleware.

Additionally, transforming the arguments or return value in the third level will **pass them on** to the next middleware or action.

:::

<details>
<summary>How does this look internally?</summary>

```ts
producer.applyMiddleware(firstMiddleware, secondMiddleware, thirdMiddleware);
```

```ts
// The first level is called once with the producer,
// and returns a function that will wrap actions
const firstWrapper = firstMiddleware(producer);
const secondWrapper = secondMiddleware(producer);
const thirdWrapper = thirdMiddleware(producer);

for (const [key, action] of actions) {
	// Action middlewares wrap around the original action,
	// each one receiving the next function in the chain:
	// first -> second -> third -> action
	actions[key] = thirdWrapper(secondWrapper(firstWrapper(action, key), key), key);
}

producer.increment(1);

// Dispatching increment now invokes the middleware chain:
// producer.increment -> first -> second -> third -> action, or
// producer.increment -> increment(third(second(first(1)))
```

</details>

---

### Cancelling actions

**Middleware can also be used to conditionally run actions.** This is useful for throttling or cancelling actions based on the current state. We'll go over how to implement a middleware that throttles actions.

A throttle middleware would cancel actions if they're called within a certain time frame. You can throttle actions by updating a cooldown timer when the dispatcher is called, and conditionally cancel it by _not_ calling `dispatch`.

**This example is a custom implementation of `throttleMiddleware`,** which cancels actions if they're called within one second of each other:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const throttleMiddleware: ProducerMiddleware = (producer) => {
	return (dispatch, name) => {
		let resumptionTime = 0;

		return (...args) => {
			// highlight-start
			if (os.clock() < resumptionTime) {
				// Cancel the action by returning early
				return producer.getState();
			}
			// highlight-end
			resumptionTime = os.clock() + 1;
			return dispatch(...args);
		};
	};
};

producer.applyMiddleware(throttleMiddleware);

producer.increment(1); // { counter: 1 }
producer.increment(1); // { counter: 1 } (cancelled)

task.wait(1);
producer.increment(1); // { counter: 2 }
```

</TabItem>
<TabItem value="Luau">

```lua
local throttleMiddleware: Reflex.Middleware = function(producer)
    return function(dispatch, name)
        local resumptionTime = 0

        return function(...)
            // highlight-start
            if os.clock() < resumptionTime then
                -- Cancel the action by returning early
                return producer:getState()
            end
            // highlight-end
            resumptionTime = os.clock() + 1
            return dispatch(...)
        end
    end
end

producer:applyMiddleware(throttleMiddleware)

producer.increment(1) --> { counter = 1 }
producer.increment(1) --> { counter = 1 } (cancelled)

task.wait(1)
producer.increment(1) --> { counter = 2 }
```

</TabItem>
</Tabs>

This implementation throttles individual actions by storing their `resumptionTime` on the second "action" level, which runs once for every action function in the producer. On the third "dispatch" level, we check if the `resumptionTime` is over yet, and if so, we call `dispatch` and update the `resumptionTime` to resume again in one second.

:::info

**Cancelling actions also cancels the middlewares after it in the chain.** For example, if we had a `loggerMiddleware` _after_ `throttleMiddleware`, it would not log actions that were throttled. If we wanted to log throttled actions, we would have to move `loggerMiddleware` _before_ `throttleMiddleware`.

:::
