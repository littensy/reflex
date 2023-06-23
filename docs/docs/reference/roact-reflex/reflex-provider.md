---
sidebar_position: 1
title: <ReflexProvider>
description: The root component for Roact Reflex.
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import TOCInline from "@theme/TOCInline";

# &lt;ReflexProvider>

`<ReflexProvider>` lets you specify a producer to use with Roact Reflex in your app.

```tsx
<ReflexProvider producer={producer}>
    <App />
</ReflexProvider>
```

<TOCInline toc={toc} />

---

## Reference

### `<ReflexProvider>`

Use `<ReflexProvider>` to make a Reflex `producer` available to the rest of your app. The Hooks can then be used by any component nested inside of `<ReflexProvider>`.

```tsx
import Roact from "@rbxts/roact";
import { ReflexProvider } from "@rbxts/roact-reflex";

Roact.mount(
    <ReflexProvider producer={producer}>
        <App />
    </ReflexProvider>,
    Players.LocalPlayer.WaitForChild("PlayerGui"),
);
```

[See more examples below.](#usage)

#### Props

-   `producer` - The root Reflex producer to use for the rest of the app.

:::info caveats

-   You should only use `<ReflexProvider>` once at the root of your app. [Learn more about using a root producer.](../reflex/combine-producers#using-multiple-producers)

:::

---

## Usage

### Setting up Roact Reflex

Roact Reflex allows you to use Hooks to access the Reflex state from anywhere in your app. To do this, you need to wrap your root component in `<ReflexProvider>` when you render it:

```tsx
import Roact from "@rbxts/roact";
import { ReflexProvider } from "@rbxts/roact-reflex";

Roact.mount(
    // highlight-next-line
    <ReflexProvider producer={producer}>
        <App />
        // highlight-next-line
    </ReflexProvider>,
    Players.LocalPlayer.WaitForChild("PlayerGui"),
);
```

Reflex uses this provider to allow components to hook into the state of your game with Hooks like [`useProducer`](use-producer). This component should be present somewhere in the root of your app anywhere you want to use a Reflex Hook.

---

### Using other providers with `ReflexProvider`

Your app may have other providers that you want to use with Roact Reflex. To do this, you can nest the providers in any order:

```tsx
import Roact from "@rbxts/roact";
import { ReflexProvider } from "@rbxts/roact-reflex";

Roact.mount(
    // highlight-next-line
    <ReflexProvider producer={producer}>
        <OtherProvider>
            <App />
        </OtherProvider>
        // highlight-next-line
    </ReflexProvider>,
    Players.LocalPlayer.WaitForChild("PlayerGui"),
);
```

It can also help to create a custom provider that combines all of your providers into one:

<Tabs>
<TabItem value="RootProvider.tsx" default>

```tsx
import Roact from "@rbxts/roact";

export function RootProvider(props: Roact.PropsWithChildren) {
    return (
        <ReflexProvider producer={producer}>
            <OtherProvider>{props[Roact.Children]}</OtherProvider>
        </ReflexProvider>
    );
}
```

</TabItem>
<TabItem value="main.client.tsx">

```tsx
import Roact from "@rbxts/roact";
import { RootProvider } from "./RootProvider";

Roact.mount(
    <RootProvider>
        <App />
    </RootProvider>,
    Players.LocalPlayer.WaitForChild("PlayerGui"),
);
```

</TabItem>
</Tabs>
