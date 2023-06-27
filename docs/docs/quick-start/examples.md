---
description: See Reflex in example projects.
---

# Examples

Reflex has a couple of example projects that you can use to get started.

## TypeScript

A minimal Roblox-TS example project using Reflex for state management.

Currently, this example has:

-   🍰 Shared producer slices
-   💾 Player data with Lapis
-   🛰️ Server-to-client data syncing

### Usage

Clone this repository to get started.

```bash
git clone https://github.com/littensy/reflex-example-ts.git

cd reflex-example-ts
npm install
npm run build
```

### Pre-requisites

-   [Roblox-TS](https://roblox-ts.com/docs/)
-   [Rojo](https://rojo.space/docs/installation/)
-   [Node.js](https://nodejs.org/en/download/)

### Recommended Extensions

-   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
-   [TestEZ Companion](https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion)

## Luau

A minimal Luau example project using Reflex for state management.

Currently, this example has:

-   🍰 Shared producer slices
-   💾 Player data with Lapis
-   🛰️ Server-to-client data syncing

### Usage

Clone this repository to get started.

```bash
git clone https://github.com/littensy/reflex-example-luau.git

cd reflex-example-luau
wally install
rojo sourcemap -o sourcemap.json
wally-package-types --sourcemap sourcemap.json Packages
```

### Pre-requisites

-   [Aftman](https://github.com/LPGhatguy/aftman)
-   [Rojo](https://rojo.space/docs/installation/)
-   [Wally](https://wally.run)

### Recommended Extensions

-   [TestEZ Companion](https://marketplace.visualstudio.com/items?itemName=tacheometrist.testez-companion)
-   [Selene](https://marketplace.visualstudio.com/items?itemName=Kampfkarren.selene-vscode)
-   [Luau LSP](https://marketplace.visualstudio.com/items?itemName=JohnnyMorganz.luau-lsp)
-   [StyLua](https://marketplace.visualstudio.com/items?itemName=JohnnyMorganz.stylua)
