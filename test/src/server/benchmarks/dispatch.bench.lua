local TS = require(game:GetService("ReplicatedStorage").include.RuntimeLib)
local Reflex = TS.import(script, game:GetService("ReplicatedStorage"), "reflex")
local Rodux =
	TS.import(script, game:GetService("ReplicatedStorage"), "include", "node_modules", "@rbxts", "rodux", "src")

local LOOPS = 500

--[[
	Benchmarker

	Run type: Time
	Run time: 1 second

	Reflex.Producer: 250 microseconds
	Rodux.Store:     500 microseconds

	Reflex tends to be 50% faster than Rodux when dispatching light actions.
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
