local TS = require(game:GetService("ReplicatedStorage").rbxts_include.RuntimeLib)
local Reflex = TS.import(script, game:GetService("ReplicatedStorage"), "reflex")
local Rodux =
	TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "rodux", "src")

--[[
	Benchmarker

	Device: MacBook Pro (M1 Pro, 16-inch, 2021)
	Run type: Time
	Run time: 1 second

	Times

	Reflex.createProducer:   60 microseconds
	Reflex.combineProducers: 75 microseconds
	Rodux.createReducer:     130 microseconds
	Rodux.combineReducers:   170 microseconds

	Summary

	Combining producers does not add a significant amount of overhead. It is
	faster than Rodux by roughly 50%.
]]

return {
	ParameterGenerator = function()
		local result = {
			producer = Reflex.combineProducers({
				a = Reflex.createProducer({ count = 0 }, {
					incrementA = function(state, amount)
						return { count = state.count + amount }
					end,
				}),
				b = Reflex.createProducer({ count = 0 }, {
					incrementB = function(state, amount)
						return { count = state.count + amount }
					end,
				}),
			}),

			producerUncombined = Reflex.createProducer({ a = { count = 0 }, b = { count = 0 } }, {
				incrementA = function(state, amount)
					return { a = { count = state.a.count + amount }, b = state.b }
				end,
				incrementB = function(state, amount)
					return { b = { count = state.b.count + amount }, a = state.a }
				end,
			}),

			store = Rodux.Store.new(Rodux.combineReducers({
				a = Rodux.createReducer({ count = 0 }, {
					incrementA = function(state, action)
						return { count = state.count + action.amount }
					end,
				}),
				b = Rodux.createReducer({ count = 0 }, {
					incrementB = function(state, action)
						return { count = state.count + action.amount }
					end,
				}),
			})),

			storeUncombined = Rodux.Store.new(Rodux.createReducer({ a = { count = 0 }, b = { count = 0 } }, {
				incrementA = function(state, action)
					return { a = { count = state.a.count + action.amount }, b = state.b }
				end,
				incrementB = function(state, action)
					return { b = { count = state.b.count + action.amount }, a = state.a }
				end,
			})),
		}

		task.defer(function()
			result.store:destruct()
			result.storeUncombined:destruct()
		end)

		return result
	end,

	Functions = {
		["Reflex.combineProducers"] = function(profiler, parameter)
			for _ = 1, 100 do
				parameter.producer.incrementA(1)
				parameter.producer.incrementB(1)
			end
		end,

		["Reflex.createProducer"] = function(profiler, parameter)
			for _ = 1, 100 do
				parameter.producerUncombined.incrementA(1)
				parameter.producerUncombined.incrementB(1)
			end
		end,

		["Rodux.combineReducers"] = function(profiler, parameter)
			for _ = 1, 100 do
				parameter.store:dispatch({ type = "incrementA", amount = 1 })
				parameter.store:dispatch({ type = "incrementB", amount = 1 })
			end
		end,

		["Rodux.createReducer"] = function(profiler, parameter)
			for _ = 1, 100 do
				parameter.storeUncombined:dispatch({ type = "incrementA", amount = 1 })
				parameter.storeUncombined:dispatch({ type = "incrementB", amount = 1 })
			end
		end,
	},
}
