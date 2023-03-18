local TS = require(game:GetService("ReplicatedStorage").include.RuntimeLib)
local Reflex = TS.import(script, game:GetService("ReplicatedStorage"), "reflex")
local Rodux =
	TS.import(script, game:GetService("ReplicatedStorage"), "include", "node_modules", "@rbxts", "rodux", "src")

local LOOPS = 500

return {
	ParameterGenerator = function()
		return {
			producer = Reflex.createProducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					local newState = table.clone(state)
					newState.countA = newState.countA + 1
					return newState
				end,
				incrementB = function(state)
					local newState = table.clone(state)
					newState.countB = newState.countB + 1
					return newState
				end,
			}),

			store = Rodux.Store.new(Rodux.createReducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					local newState = table.clone(state)
					newState.countA = newState.countA + 1
					return newState
				end,
				incrementB = function(state)
					local newState = table.clone(state)
					newState.countB = newState.countB + 1
					return newState
				end,
			})),
		}
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
