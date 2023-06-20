---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TOCInline from '@theme/TOCInline';

# createSelector

`createSelector` lets you skip re-computing a value if the inputs/dependencies haven't changed.

```ts
const selector = createSelector(dependencies, combiner);
```

<TOCInline toc={toc} />

---

## Reference

### `createSelector(dependencies, combiner)`

`createSelector` returns a _memoized_ selector. This memoized selector will not call the combiner unless the arguments or the results of `dependencies` have changed. Calling this selector will pass the input arguments to each dependency, and then pass the results of those dependencies to the `combiner`.

The `combiner` function is called with the results of the dependencies as arguments, in the same order as the dependencies passed to `createSelector`. The result of the `combiner` is the final value that the selector will cache and return.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectArray = (state: State) => state.array;
const selectMap = (state: State) => state.map;

const selectValues = createSelector([selectArray, selectMap] as const, (array, map) => {
	return [...array, ...Object.values(map)];
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectArray(state: State)
    return state.array
end

local function selectMap(state: State)
    return state.map
end

local selectValues = createSelector({ selectArray, selectMap }, function(array, map)
    local values = table.clone(array)
    for _, value in map do
        table.insert(values, value)
    end
    return values
end)
```

</TabItem>
</Tabs>

Both the `combiner` and the `dependencies` are memoized. This means that the dependencies are not called unless the arguments to the selector have changed, and the combiner is not called unless the dependencies return new values.

[See more examples below.](#usage)

#### Parameters

-   `dependencies` - An array of selectors, the results of which will be passed to the combiner.
-   `combiner` - A function that takes the results of the dependencies and returns a value.

#### Returns

`createSelector` returns a memoized selector. It behaves as a normal selector, but the result is cached and only re-computed if the arguments or dependencies change.

:::info Caveats

-   **Your functions should be _idempotent_;** they should always return the same result for the same inputs. Otherwise, the selector may not work as expected.

-   **Dependencies are compared by reference (`===`).** Even if a function returns an object that's shallowly equal to the previous result, it will still be seen as an update, and the selector will still re-compute.

-   **If you're writing a selector returns a new object or array** (i.e. filtering, sorting, etc.), you should **always** use `createSelector`. Otherwise, the selector will return a new object/array every time it's called, and listeners will run excessively. [See the `subscribe` function for other caveats.](producer#subscribeselector-listener)

:::

---

## Usage

### Transforming state

Often, you'll want to sort a list of items, filter out items that don't match a certain criteria, or perform some other transformation on your state. But trying to include these transformations in your state can quickly become difficult to keep up-to-date. **Selectors are a great way to derive new values from state!** With selectors, you can create a new object/array and apply transformations as needed.

**But one small mistake can worsen performance or cause unexpected behavior.** Let's say you have a list of items in your cart, and you want to filter out items that are out of stock. Your producer might look something like this:

<Tabs>
<TabItem value="TypeScript" default>

```ts
interface CartState {
	readonly items: readonly CartItem[];
}

interface CartItem {
	readonly name: string;
	readonly price: number;
	readonly stock: number;
}

const initialState: CartState = {
	items: [],
};

const producer = createProducer(initialState, {
	addItem: (state, item: CartItem) => ({
		...state,
		items: [...state.items, item],
	}),
});
```

</TabItem>
<TabItem value="Luau">

```lua
type CartState = {
    items: { CartItem },
}

type CartItem = {
    name: string,
    price: number,
    stock: number,
}

local initialState: CartState = {
    items = {},
}

local producer = createProducer(initialState, {
    addItem = function(state, item: CartItem)
        local nextState = table.clone(state)
        local nextItems = table.clone(state.items)

        table.insert(nextItems, item)
        nextState.items = nextItems

        return nextState
    end,
})
```

</TabItem>
</Tabs>

You have a shopping cart that contains a list of items, each with a `name`, `price`, and `stock` property. How would you [subscribe](producer#running-side-effects) to state and filter out items that are in stock?

Your first instinct might be to write a simple function that filters items with a `stock` above zero:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectInStock = (state: CartState) => {
	// error-next-line
	return state.items.filter((item) => item.stock > 0);
};

producer.subscribe(selectInStock, (stock) => {
	print("Items available:", stock);
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectInStock(state: CartState)
    // error-next-line
    local stock = {}
    for _, item in state.items do
        if item.stock == 0 then
            table.insert(stock, item)
        end
    end
    // error-next-line
    return stock
end

producer:subscribe(selectInStock, function(stock)
    print("Items available:", stock)
end)
```

</TabItem>
</Tabs>

**This works, but it's not very efficient.** The listener will run every time the state updates, even if the items themselves haven't changed!

:::info why?

By [subscribing to state](producer#running-side-effects) with a selector, you essentially tell Reflex to run your selector **every time the state changes.** This is to compare the result with the previous value to detect a change, which is fine for simple selectors, but it can be inefficient if your selector returns new tables and functions, or is expensive to compute.

In this case, every time the selector is called, it creates an **entirely new list** of in-stock items. This is bad because [`subscribe`](producer#subscribeselector-listener) compares the new value to the previous value by reference (`===`), and since the selector only returns new arrays, Reflex will consider every unrelated state change to be an update. **Your listener will be called excessively, even if the items haven't changed!**

:::

**_Memoization_** is a technique that allows you to cache the result of a function, and only re-compute it if the arguments change. [`createSelector`](#createselectordependencies-combiner) offers a simple way to memoize selectors and avoid unnecessary re-computations, and is useful for writing efficient selectors that only run when needed.

We can wrap the selector in [`createSelector`](#createselectordependencies-combiner), and specify `state.items` as a dependency. With this change, the selector will only be called when `state.items` updates:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectItems = (state: CartState) => state.items;

// highlight-start
const selectInStock = createSelector([selectItems] as const, (items) => {
	return items.filter((item) => item.stock > 0);
});
// highlight-end

producer.subscribe(selectInStock, (stock) => {
	print("Items available:", stock);
});
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectItems(state: CartState)
    return state.items
end

// highlight-start
local selectInStock = createSelector({ selectItems }, function(items)
    local stock = {}
    for _, item in items do
        if item.stock == 0 then
            table.insert(stock, item)
        end
    end
    return stock
end)
// highlight-end

producer:subscribe(selectInStock, function(stock)
    print("Items available:", stock)
end)
```

</TabItem>
</Tabs>

**The `selectInStock` function is now _memoized_.** In other words, it will only return a new list of items in-stock if `state.items` changed. This is much safer and more efficient than the previous example.

You'd pass two arguments to [`createSelector`](#createselectordependencies-combiner):

1.  An array of dependencies, which are selectors that the memoized selector depends on.
2.  A "combiner" function that transforms the dependencies into a new value.

[`createSelector`](#createselectordependencies-combiner) then returns a new, memoized selector. Both the dependencies and the combiner function are memoized, so the selector will only re-compute if the selector arguments _and_ the combiner dependencies change. There are three steps the selector takes to determine the return value:

1.  Make sure the arguments have changed since the last call.
2.  Call each dependency with the arguments and check if any of them changed.
3.  Call the combiner function with the new results of each dependency.

If all of the steps above pass, the selector will return the new value. Otherwise, it will return the previous value and skip the combiner function. The process is very fast, and helps keep your selectors efficient.

For a more in-depth explanation of selectors, check out the [official Redux documentation.](https://redux.js.org/usage/deriving-data-selectors) Most of the concepts apply to Reflex as well.

---

### Passing input parameters

Common use cases for selectors are retrieving an item's state and applying search filters, but passing the external parameters needed to retrieve the information can be unintuitive at first.

We'll go over two main ways to pass arguments to a selector:

1.  [**Selector factories:**](#selector-factories) Pass arguments to a creator function, which returns a new selector. This is best used for creating selectors that are **specialized for unique, unchanging parameters,** like tracking an item's state by ID.

2.  [**Store parameters in state:**](#store-parameters-in-state) Store parameters in state and use them as dependencies. This is best used for selectors that depend on **shared or frequently-changing parameters,** like search queries or the sort order of a list.

This decision only _really_ matters if your selectors are expensive to run, and in most cases, you can just use whichever makes the most sense to you. There's also [currying dependencies](https://redux.js.org/usage/deriving-data-selectors#passing-input-parameters), but it's not fully supported by Reflex's APIs.

#### Selector factories

Selector factories are functions that, given an initial set of arguments, return a new selector for those arguments. A unique instance of a selector with its own result cache is created for a given call to the factory.

**It's best to use factories when selectors are created for a specific purpose.** This can include:

-   **Selecting the state of an item by ID.** For example, you might want to [play a damage sound when a specific player is hurt](producer#observing-additions-and-removals).

-   **Deriving new values from a specific item.** If you want to enhance an item with additional data, like a formatted price or a localized name, you can create a factory that takes an ID as an argument and returns a selector that enhances the item.

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectItems = (state: CartState) => state.items;

// highlight-next-line
const selectItemById = (id: number) => {
	return createSelector([selectItems] as const, (items) => {
		return items.find((item) => item.id === id);
	});
};

producer.subscribe(selectItemById(1), print);
producer.subscribe(selectItemById(2), print);
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectItems(state: CartState)
    return state.items
end

// highlight-next-line
local function selectItemById(id: number)
    return createSelector({ selectItems }, function(items)
        for _, item in items do
            if item.id == id then
                return item
            end
        end
    end)
end

producer:subscribe(selectItemById(1), print)
producer:subscribe(selectItemById(2), print)
```

</TabItem>
</Tabs>

:::info caveats

**Having too many selectors with the same arguments at once can be wasteful.** _Duplicate selectors_ are not ideal because each selector has its own cache, and can re-compute their value even if another duplicate just performed the same update. However, if you're only using a few selectors at a time, this is perfectly fine.

[Consider storing parameters in state if you don't need unique selectors.](#store-parameters-in-state)

:::

<details>
<summary>What are the pros and cons of this approach?</summary>

:::tip pros

-   **Results are cached per selector.** Two selectors created to select different user IDs will only trigger a state update if their respective users change. This is unlike [sharing parameters in state](#store-parameters-in-state), where one selector tracks changing parameters.

-   **Selectors can have state.** You can assign logic to individual selectors, which can be used to store a history of state or other data.

:::

:::danger cons

-   **Memoizing the result is up to you.** Be careful when using factories in Roact function components, as **creating new selectors every re-render will reset the cache.** Reflex offers memoization of factories with the `useSelectorCreator` Hook.

-   **Avoid duplicate selectors.** While selectors having their own caches is useful, it can become suboptimal if you create lots of selectors with the same arguments. This can lead to unnecessary re-computations, as duplicate selectors don't know that the other has already been called with the same arguments.

:::

</details>

#### Store parameters in state

If you need to pass parameters that change often to a selector, it's best to store them in state and use them as dependencies. This is useful for selectors that are used in many places with shared parameters, or selectors only used in one place, like a search query or a sort order.

**It's best to use state when selector parameters update frequently,** like in response to user input. This is because in order to update a parameter with [selector factories](#selector-factories), you need to create a new selector, which is not always necessary. You can instead store the query in state and use it as a dependency:

<Tabs>
<TabItem value="TypeScript" default>

```ts
const selectItems = (state: CartState) => state.items.list;

const selectItemQuery = (state: CartState) => state.items.query;

// highlight-next-line
const selectFilteredItems = createSelector([selectItems, selectItemQuery] as const, (items, query) => {
	return items.filter((item) => {
		const [match] = item.name.lower().match(query.lower());
		return match !== undefined;
	});
});

producer.subscribe(selectFilteredItems, print);
```

</TabItem>
<TabItem value="Luau">

```lua
local function selectItems(state: CartState)
    return state.items.list
end

local function selectItemQuery(state: CartState)
    return state.items.query
end

// highlight-next-line
local selectFilteredItems = createSelector({ selectItems, selectItemQuery }, function(items, query)
    local filteredItems = {}
    for _, item in items do
        if string.match(string.lower(item.name), string.lower(query)) then
            table.insert(filteredItems, item)
        end
    end
    return filteredItems
end)

producer:subscribe(selectFilteredItems, print)
```

</TabItem>
</Tabs>

<details>
<summary>What are the pros and cons of this approach?</summary>

:::tip pros

-   **Multiple listeners can share the same selector.** This is unlike [selector factories](#selector-factories), where each selector has its own cache and can re-compute their value even if another duplicate just performed the same update.

-   **It's safer to use.** You don't need any extra logic like `useSelectorCreator` to prevent creating new selectors when it's not necessary.

:::

:::danger cons

-   **You can't pass different parameters to the same selector.** If you want to apply different transformations to your state in different places, consider [selector factories](#selector-factories).

-   **It's not a replacement for factories.** If you don't want to share parameters, or find yourself setting parameters manually before calling a selector, you should use a [selector factory](#selector-factories) instead.

:::

</details>

---

## Troubleshooting
