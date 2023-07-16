---
sidebar_position: 7
description: Create a broadcast receiver to sync the client's root producer with the server's shared state.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TOCInline from "@theme/TOCInline";

# createBroadcastReceiver

`createBroadcastReceiver` lets you keep the client's state in sync with the server's shared state, whose updates are sent by [`createBroadcaster`](create-broadcaster).

```ts
const receiver = createBroadcastReceiver({ requestState });
```

<TOCInline toc={toc} />

---

## Reference

### `createBroadcastReceiver(options)`

Call `createBroadcastReceiver` to create a receiver that can be used to connect your state to the [broadcaster](create-broadcaster) on the server.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createBroadcastReceiver } from "@rbxts/reflex";

const receiver = createBroadcastReceiver({
	requestInterval: 5,
	requestState: async () => {
		const remote = await remotes.Client.WaitFor("requestState");
		return remote.CallServerAsync();
	},
});
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local receiver = Reflex.createBroadcastReceiver({
    requestInterval = 5,
    requestState = function()
        return remotes.Client:WaitFor("requestState"):andThen(function(remote)
            return remote:CallServerAsync()
        end)
    end,
})
```

</TabItem>
</Tabs>

Once you have the receiver, you need to apply the middleware to your producer and connect [`dispatch`](#receiverdispatchactions) to a remote:

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
remotes.Client.OnEvent("broadcast", (actions) => {
	receiver.dispatch(actions);
});

producer.applyMiddleware(receiver.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua
remotes.Client:OnEvent("broadcast", function(actions)
    receiver:dispatch(actions)
end)

producer:applyMiddleware(receiver.middleware)
```

</TabItem>
</Tabs>

`createBroadcastReceiver` will request the server's shared state when the middleware is applied, and _merge_ it with the client's state. This means that the client's state will not be overwritten, but instead updated with the server's state. It is safe to use your producer before the server's state is received.

[Broadcasters](create-broadcaster) send shared actions dispatched on the server to the client through a remote, so you need to connect the receiver's [`dispatch`](#receiverdispatchactions) method to run the actions passed to the remote.

On the server, call [`createBroadcaster`](create-broadcaster) to share state and actions with the client.

[See more examples below.](#usage)

#### Parameters

-   `options` - An object with options for the broadcast receiver.
    -   `requestState` - A function that returns a Promise that resolves to the server's shared state.
    -   `requestInterval` - The interval in seconds to sync the store with the server's state. Defaults to `5`. Set to `0` to disable requests.

#### Returns

`createBroadcastReceiver` returns a receiver object with a [`dispatch`](#receiverdispatchactions) method and a [`middleware`](#receivermiddleware) property.

:::info caveats

-   [**Data that is not remote-friendly will be lost.**](create-broadcaster#the-client-receives-invalid-state) Because data is sent through remote events, you will lose metatables, functions, and numeric keys.

:::

---

### `receiver.middleware`

Apply the broadcast receiver [middleware](middleware) to call `requestState` and initialize the client's root producer with the server's shared state. It's safe to use the producer before this middleware is applied, and order does not matter.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
producer.applyMiddleware(receiver.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua
producer:applyMiddleware(receiver.middleware)
```

</TabItem>
</Tabs>

---

### `receiver.dispatch(actions)`

Connect the receiver's `dispatch` method to a remote to dispatch the actions passed to the remote.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
remotes.Client.OnEvent("broadcast", (actions) => {
	receiver.dispatch(actions);
});
```

</TabItem>
<TabItem value="Luau">

```lua
remotes.Client:OnEvent("broadcast", function(actions)
    receiver:dispatch(actions)
end)
```

</TabItem>
</Tabs>

#### Parameters

-   `actions` - An array of `BroadcastAction` objects to dispatch.

#### Returns

`receiver.dispatch` returns nothing.

---

## Usage

### Syncing server state on the client

If you haven't already, see how to [send server state to clients](create-broadcaster#sending-server-state-to-clients) to create a basic project setup. The [`createBroadcaster`](create-broadcaster) page is treated as the primary reference for this feature.

Once you have your broadcaster set up, you can use [`createBroadcastReceiver`](#createbroadcastreceiveroptions) to initialize the client state with the server's shared state and keep it in sync.

<Tabs groupId="languages">
<TabItem value="TypeScript" default>

```ts
import { createBroadcastReceiver } from "@rbxts/reflex";

const receiver = createBroadcastReceiver({
	requestState: async () => {
		const remote = await remotes.Client.WaitFor("requestState");
		return remote.CallServerAsync();
	},
});

remotes.Client.OnEvent("broadcast", (actions) => {
	receiver.dispatch(actions);
});

producer.applyMiddleware(receiver.middleware);
```

</TabItem>
<TabItem value="Luau">

```lua
local Reflex = require(ReplicatedStorage.Packages.Reflex)

local receiver = Reflex.createBroadcastReceiver({
    requestState = function()
        return remotes.Client:WaitFor("requestState"):andThen(function(remote)
            return remote:CallServerAsync()
        end)
    end,
})

remotes.Client:OnEvent("broadcast", function(actions)
    receiver:dispatch(actions)
end)

producer:applyMiddleware(receiver.middleware)
```

</TabItem>
</Tabs>

This code will call `requestState` when the middleware is applied, and merge the server's shared state with the client's state. You should also connect the receiver's `dispatch` method to the remote, so that the state continues to be kept in sync.

**It's user-friendly,** as you can set up `createBroadcastReceiver` in a file separate from your producer and it will work as long as you apply the middleware to the producer and connect the receiver's `dispatch` method to the remote.

It's safe to apply the middleware at any time, and you can even use your producer before the server's state is received.

---

### Sending server state to clients

[To share the server's state with clients, see `createBroadcaster`.](create-broadcaster)
