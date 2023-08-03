curl -o scripts/roblox.d.lua https://raw.githubusercontent.com/JohnnyMorganz/luau-lsp/main/scripts/globalTypes.d.lua

rojo sourcemap default.project.json -o sourcemap.json

luau-lsp analyze --defs=scripts/roblox.d.lua --defs=scripts/testez.d.lua --sourcemap=sourcemap.json --no-strict-dm-types src

rm scripts/roblox.d.lua
