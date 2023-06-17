local TS = require(game:GetService("ReplicatedStorage").rbxts_include.RuntimeLib)
local Reflex = TS.import(script, game:GetService("ReplicatedStorage"), "reflex")
local Rodux =
	TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "rodux", "src")

local LOOPS = 500

--[[
	Benchmarker

	Device: MacBook Pro (M1 Pro, 16-inch, 2021)
	Run type: Time
	Run time: 1 second

	Times

	Reflex.Producer: 160 microseconds
	Rodux.Store:     470 microseconds

	Summary

	Overall, Reflex is nearly 3x faster than Rodux when dispatching simple actions.
]]

return {
	ParameterGenerator = function()
		local result = {
			producer = Reflex.createProducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					return { countA = state.countA + 1, countB = state.countB }
				end,
				incrementB = function(state)
					return { countA = state.countA, countB = state.countB + 1 }
				end,
			}),

			store = Rodux.Store.new(Rodux.createReducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					return { countA = state.countA + 1, countB = state.countB }
				end,
				incrementB = function(state)
					return { countA = state.countA, countB = state.countB + 1 }
				end,
			})),
		}

		-- Destroy the Rodux stores to prevent memory leaks
		task.defer(function()
			result.store:destruct()
		end)

		return result
	end,

	Functions = {
		["Reflex.Producer"] = function(profiler, parameter)
			for _ = 1, LOOPS do
				parameter.producer.incrementA()
				parameter.producer.incrementB()
			end
		end,

		["Rodux.Store"] = function(profiler, parameter)
			for _ = 1, LOOPS do
				parameter.store:dispatch({ type = "incrementA" })
				parameter.store:dispatch({ type = "incrementB" })
			end
		end,
	},
}
