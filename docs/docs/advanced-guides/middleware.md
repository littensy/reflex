---
description: Learn how to use middleware in Reflex.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Middleware

[Middleware](../reference/reflex/middleware) is a powerful concept in Reflex that allows you to enhance your producer and actions with additional functionality.

:::note what you'll learn

-   🧩 What middleware is
-   🔍 The structure of middleware
-   🔌 How to use middleware
-   📝 How to write your own middleware
-   📚 Common middleware

:::

---

## What is middleware?

In state management libraries, middleware provides a way to insert code in between the dispatch of an action, and the moment the action is called. It is often used to log actions, perform asynchronous tasks, or add additional data to the action.

---

## Using middleware

Reflex middleware has three layers of control that enable you to customize the behavior of your producers in powerful ways. A basic middleware function looks like this:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const middleware: ProducerMiddleware = (producer) => {
	return (nextAction, name) => {
		return (...args) => nextAction(...args);
	};
};
```

</TabItem>
<TabItem value="Luau">

```lua
local middleware: Reflex.Middleware = function(producer)
    return function(nextAction, name)
        return function(...)
            return nextAction(...)
        end
    end
end
```

</TabItem>
</Tabs>

You can separate the middleware into three layers:

1. **The producer**
    - The middleware itself is called once when it is initially applied to a producer.
2. **The action wrapper**
    - This is called once per action when the middleware is applied, and receives a `nextAction` function and the name of the action.
    - It returns a function that can run additional code before or after the next middleware or action runs.
3. **The dispatcher**
    - This is called in place of the action during a dispatch, and can call `nextAction` to run the action.
    - If middleware is applied after this one, `nextAction` invokes the next middleware.

But this can be difficult to visualize, so let's try to build our own middleware.

### Logging actions

You may have learned how to [subscribe to state changes](../guides/subscribing-to-state) in a previous guide, but that covered running side effects when _state_ changes, not when actions are dispatched. What if you want to log the actions themselves as they happen?

We can create a **middleware** that logs actions as they are dispatched. Let's start with the first layer of middleware, which is called when the middleware is applied to a producer. We'll use this layer to subscribe to state changes, so we can log how actions change the state:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const loggerMiddleware: ProducerMiddleware = (producer) => {
	// highlight-start
	producer.subscribe((state) => {
		print("next state:", state);
	});
	// highlight-end

	return (nextAction, name) => {
		return (...args) => nextAction(...args);
	};
};
```

</TabItem>
<TabItem value="Luau">

```lua
local loggerMiddleware: Reflex.Middleware = function(producer)
    // highlight-start
    producer:subscribe(function(state)
        print("next state:", state)
    end)
    // highlight-end

    return function(nextAction, name)
        return function(...)
            return nextAction(...)
        end
    end
end
```

</TabItem>
</Tabs>

The next **action wrapper** is called once per action when the middleware is applied, and returns a function that essentially _replaces_ the action in the producer. We'll use this to modify an action to log the action name and arguments before continuing with the dispatch:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const loggerMiddleware: ProducerMiddleware = (producer) => {
	producer.subscribe((state) => {
		print("next state:", state);
	});

	return (nextAction, name) => {
		// highlight-start
		return (...args) => {
			print(`dispatching ${name}:`, ...args);
			return nextAction(...args);
		};
		// highlight-end
	};
};
```

</TabItem>
<TabItem value="Luau">

```lua
local loggerMiddleware: Reflex.Middleware = function(producer)
    producer:subscribe(function(state)
        print("next state:", state)
    end)

    return function(nextAction, name)
        // highlight-start
        return function(...)
            print("dispatching " .. name .. ":", ...)
            return nextAction(...)
        end
        // highlight-end
    end
end
```

</TabItem>
</Tabs>

And that's it! We've built a middleware that logs actions as they are dispatched. We can apply it to our producer with [`applyMiddleware`](../reference/reflex/producer#applymiddlewaremiddlewares):

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const counter = createProducer(0, {
	set: (state, value: number) => value,
	increment: (state, amount: number) => state + amount,
});

counter.applyMiddleware(loggerMiddleware);
counter.set(5);
counter.increment(1);
```

</TabItem>
<TabItem value="Luau">

```lua
local counter = Reflex.createProducer(0, {
    set = function(state, value: number)
        return value
    end,
    increment = function(state, amount: number)
        return state + amount
    end,
})

counter:applyMiddleware(loggerMiddleware)
counter.set(5)
counter.increment(1)
```

</TabItem>
</Tabs>

```bash title="Output"
# dispatching set: 5
# dispatching increment: 1
# next state: 6
```

Now, we can see the actions as they are dispatched, and how they change the state.

Reflex comes with a built-in [`loggerMiddleware`](../reference/reflex/middleware#loggermiddleware) that does exactly this, so you don't have to write it yourself.

### Crash reporting

Another common use case for middleware is crash reporting. You can use middleware to catch errors in your actions, and report them as they happen:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const crashReporterMiddleware: ProducerMiddleware = (producer) => {
	return (nextAction, name) => {
		return (...args) => {
			try {
				return nextAction(...args);
			} catch (error) {
				warn(`caught error in ${name}:`, error);
				return producer.getState();
			}
		};
	};
};
```

</TabItem>
<TabItem value="Luau">

```lua
local crashReporterMiddleware: Reflex.Middleware = function(producer)
    return function(action, name)
        return function(...)
            local success, result = pcall(action, ...)
            if not success then
                warn("caught error in " .. name .. ":", result)
                return producer:getState()
            end
            return result
        end
    end
end
```

</TabItem>
</Tabs>

If an error is thrown by an action or a later middleware, the crash reporter will catch it and log it, then return the current state. This prevents the error from propagating to the rest of the game.

### Cancelling actions

You can also use middleware to cancel actions. If you don't want an action to be dispatched, you can return the current state instead of calling the next action:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const cancelMiddleware: ProducerMiddleware = (producer) => {
	return (nextAction, name) => {
		if (name !== "increment") {
			return nextAction;
		}

		return (...args) => {
			print("cancelled increment!");
			// highlight-next-line
			return producer.getState();
		};
	};
};
```

</TabItem>
<TabItem value="Luau">

```lua
local cancelMiddleware: Reflex.Middleware = function(producer)
    return function(nextAction, name)
        if name ~= "increment" then
            return nextAction
        end

        return function(...)
            print("cancelled increment!")
            // highlight-next-line
            return producer:getState()
        end
    end
end
```

</TabItem>
</Tabs>

Now, if we apply this middleware to our producer, we can see that the `increment` action is cancelled:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const counter = createProducer(0, {
	set: (state, value: number) => value,
	increment: (state, amount: number) => state + amount,
});

counter.applyMiddleware(cancelMiddleware);
counter.set(5);
counter.increment(1);
print(counter.getState());
```

</TabItem>
<TabItem value="Luau">

```lua
local counter = Reflex.createProducer(0, {
    set = function(state, value: number)
        return value
    end,
    increment = function(state, amount: number)
        return state + amount
    end,
})

counter:applyMiddleware(cancelMiddleware)
counter.set(5)
counter.increment(1)
print(counter:getState())
```

</TabItem>
</Tabs>

```bash title="Output"
# cancelled increment!
# 5
```

:::caution

Cancelling an action also prevents the middleware _after_ `cancelMiddleware` from being called! This means that if you want some middleware to never get cancelled by `cancelMiddleware`, pass it to `applyMiddleware` before it.

:::

### Using multiple middlewares

You can apply multiple middlewares to a producer, and they will be called in the order they are applied. This means that the first middleware will be called with your initial arguments, and the last middleware will invoke the original action.

Let's try applying both the logger and cancel middlewares to our producer:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const counter = createProducer(0, {
	set: (state, value: number) => value,
	increment: (state, amount: number) => state + amount,
});

counter.applyMiddleware(cancelMiddleware, loggerMiddleware);
counter.set(5);
counter.increment(1);
```

</TabItem>
<TabItem value="Luau">

```lua
local counter = Reflex.createProducer(0, {
    set = function(state, value: number)
        return value
    end,
    increment = function(state, amount: number)
        return state + amount
    end,
})

counter:applyMiddleware(cancelMiddleware, loggerMiddleware)
counter.set(5)
counter.increment(1)
```

</TabItem>
</Tabs>

```bash title="Output"
# dispatching set: 5
# cancelled increment!
# next state: 5
```

The `set` action set the state to `5`, and the `increment` action was cancelled, so the final state was determined to be `5`.

But wait, why didn't the logger middleware print the `increment` action? That's because the order of middleware matters!

---

## Ordering middleware

The order in which you apply middleware is important. If the first middleware cancels an action, the rest of the middleware will not be called. This means that middleware that you want to always run should be applied first, and middleware that you want to run last should be applied last.

### Cancel actions to cancel middleware

In the last section, we applied a cancel middleware and a logger middleware to our producer. The call chain looked like this:

```ts
counter.increment(1)
// error-next-line
=> cancel(1) // 🔴 Cancelled
=> logger(1)
=> increment(1)
```

If we also want to log cancelled actions, we need to apply the logger middleware _before_ the cancel middleware:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
counter.applyMiddleware(loggerMiddleware, cancelMiddleware);
counter.increment(1);
```

</TabItem>
<TabItem value="Luau">

```lua
counter:applyMiddleware(loggerMiddleware, cancelMiddleware)
counter.increment(1)
```

</TabItem>
</Tabs>

```ts
counter.increment(1)
=> logger(1)
// error-next-line
=> cancel(1) // 🔴 Cancelled
=> increment(1)
```

```bash title="Output"
# dispatching increment: 1
# cancelled increment!
```

### Transforming arguments

We can also insert a middleware that modifies the action's arguments! Let's say we want to double the amount that the counter is incremented by:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const doubleMiddleware: ProducerMiddleware = (producer) => {
	return (nextAction, name) => {
		if (name !== "increment") {
			return nextAction;
		}

		return (amount: number) => {
			// highlight-next-line
			return nextAction(amount * 2);
		};
	};
};
```

</TabItem>
<TabItem value="Luau">

```lua
local doubleMiddleware: Reflex.Middleware = function(producer)
    return function(nextAction, name)
        if name ~= "increment" then
            return nextAction
        end

        return function(amount: number)
            // highlight-next-line
            return nextAction(amount * 2)
        end
    end
end
```

</TabItem>
</Tabs>

This middleware will double the amount that the counter is incremented by, but only if the action is an `increment` action. If it's named anything else, it will skip the middleware and call the next one in the chain.

Let's apply this middleware to our producer, and see what happens:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
const counter = createProducer(0, {
	set: (state, value: number) => value,
	increment: (state, amount: number) => state + amount,
});

counter.applyMiddleware(doubleMiddleware, loggerMiddleware);
counter.set(5);
counter.increment(1);
```

</TabItem>
<TabItem value="Luau">

```lua
local counter = Reflex.createProducer(0, {
    set = function(state, value: number)
        return value
    end,
    increment = function(state, amount: number)
        return state + amount
    end,
})

counter:applyMiddleware(doubleMiddleware, loggerMiddleware)
counter.set(5)
counter.increment(1)
```

</TabItem>
</Tabs>

```ts
producer.increment(1)
// highlight-start
=> double(1)
=> logger(1 * 2)
// highlight-end
=> increment(2)
```

```bash title="Output"
# dispatching set: 5
# dispatching increment: 2
# next state: 7
```

As you can see, the increment amount was doubled because `double` called `logger` with the doubled amount, and the logger middleware received doubled amount.

However, if we apply the logger middleware _before_ the double middleware, we get a different output:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.applyMiddleware(loggerMiddleware, doubleMiddleware);
producer.set(5);
producer.increment(1);
```

</TabItem>
<TabItem value="Luau">

```lua
producer:applyMiddleware(loggerMiddleware, doubleMiddleware)
producer.set(5)
producer.increment(1)
```

</TabItem>
</Tabs>

```ts
producer.increment(1)
// highlight-next-line
=> logger(1)
=> double(1)
=> increment(1 * 2)
```

```bash title="Output"
# dispatching set: 5
# dispatching increment: 1
# next state: 7
```

As you can see, the next state is still `7` even though the logger said the `count` was incremented by `1`. This is because the logger middleware received the number `1` _before_ the double middleware could transform it in the chain, so it logged the original amount.

**This is why the order in which you apply middleware is important.** If you have a middleware that modifies the action or its results, and you want another middleware to work with the initial data, you should apply the second middleware _before_ the first one, so it gets called first.

---

## How does it look internally?

If you're curious about how Reflex applies middleware, here's a technical look at how the middlewares from the [ordering middleware](#ordering-middleware) section is applied to the `increment` action:

```ts
producer.applyMiddleware(loggerMiddleware, cancelMiddleware, doubleMiddleware);
```

```ts
// The middleware is called and returns an action wrapper
const doubleWrapper = doubleMiddleware(counter);
const cancelWrapper = cancelMiddleware(counter);
const loggerWrapper = loggerMiddleware(counter);

// The action wrapper is called with 'nextAction' being the next
// action or middleware in the chain
counter.increment = doubleWrapper(counter.increment, "increment");
counter.increment = cancelWrapper(counter.increment, "increment");
counter.increment = loggerWrapper(counter.increment, "increment");

// Calling this action goes through the middleware chain first:
// => logger(1)
// => cancel(1)
// => double(1)
// => increment(1 * 2)
counter.increment = doubleIncrement;
```

:::info why are middlewares called in reverse?

The `nextAction` argument passed to the action wrapper is the _next_ action or middleware in the chain, but we can only know the next action by calling its action wrapper first. By composing the middleware functions in reverse, we can make sure that:

1. `loggerAction` is called first, and invokes `cancelAction` with the result
2. `cancelAction` is called next, and invokes `doubleAction` next if it wasn't cancelled
3. `doubleAction` is called last, and calls the `increment` action with the doubled amount

You can imagine the chain being composed like this:

```ts
loggerWrapper(cancelWrapper(doubleWrapper(counter.increment)));
```

:::

---

## Summary

-   **Middleware** is used to run code in between an action dispatch and the moment it updates the state.
-   Call `applyMiddleware` on a producer to apply middleware to it.
-   You can use middleware to **cancel** an action or **transform** its input or output.
-   Cancelling an action will also prevent any middleware after it from running.
-   The order in which you apply middleware is important.

[Read more on middleware →](../reference/reflex/middleware)
