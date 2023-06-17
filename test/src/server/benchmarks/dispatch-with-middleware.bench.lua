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

	Reflex no middleware: 100 microseconds
	Reflex middleware:    110 microseconds
	Rodux no middleware:  300 microseconds
	Rodux middleware:     320 microseconds

	Summary

	Reflex producers with middleware is roughly 60% faster than Rodux stores
	with middleware and has about 40% less overhead.
]]

return {
	ParameterGenerator = function()
		local function reflexMiddleware(producer)
			return function(nextDispatch, name)
				return function(...)
					return nextDispatch(...)
				end
			end
		end

		local function roduxMiddleware(nextDispatch, store)
			return function(action)
				return nextDispatch(action)
			end
		end

		local result = {
			producer = Reflex.createProducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					return { countA = state.countA + 1, countB = state.countB }
				end,
				incrementB = function(state)
					return { countA = state.countA, countB = state.countB + 1 }
				end,
				incrementC = function(state)
					return { countA = state.countA + 1, countB = state.countB + 1 }
				end,
			}):applyMiddleware(reflexMiddleware),

			producerNoMiddleware = Reflex.createProducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					return { countA = state.countA + 1, countB = state.countB }
				end,
				incrementB = function(state)
					return { countA = state.countA, countB = state.countB + 1 }
				end,
				incrementC = function(state)
					return { countA = state.countA + 1, countB = state.countB + 1 }
				end,
			}),

			store = Rodux.Store.new(
				Rodux.createReducer({ countA = 0, countB = 0 }, {
					incrementA = function(state)
						return { countA = state.countA + 1, countB = state.countB }
					end,
					incrementB = function(state)
						return { countA = state.countA, countB = state.countB + 1 }
					end,
					incrementC = function(state)
						return { countA = state.countA + 1, countB = state.countB + 1 }
					end,
				}),
				nil,
				{ roduxMiddleware }
			),

			storeNoMiddleware = Rodux.Store.new(Rodux.createReducer({ countA = 0, countB = 0 }, {
				incrementA = function(state)
					return { countA = state.countA + 1, countB = state.countB }
				end,
				incrementB = function(state)
					return { countA = state.countA, countB = state.countB + 1 }
				end,
				incrementC = function(state)
					return { countA = state.countA + 1, countB = state.countB + 1 }
				end,
			})),
		}

		-- Destroy the Rodux stores to prevent memory leaks
		task.defer(function()
			result.store:destruct()
			result.storeNoMiddleware:destruct()
		end)

		return result
	end,

	Functions = {
		["Reflex middleware"] = function(profiler, parameter)
			for _ = 1, 200 do
				parameter.producer.incrementA()
				parameter.producer.incrementB()
				parameter.producer.incrementC()
			end
		end,

		["Reflex no middleware"] = function(profiler, parameter)
			for _ = 1, 200 do
				parameter.producerNoMiddleware.incrementA()
				parameter.producerNoMiddleware.incrementB()
				parameter.producerNoMiddleware.incrementC()
			end
		end,

		["Rodux middleware"] = function(profiler, parameter)
			for _ = 1, 200 do
				parameter.store:dispatch({ type = "incrementA" })
				parameter.store:dispatch({ type = "incrementB" })
				parameter.store:dispatch({ type = "incrementC" })
			end
		end,

		["Rodux no middleware"] = function(profiler, parameter)
			for _ = 1, 200 do
				parameter.storeNoMiddleware:dispatch({ type = "incrementA" })
				parameter.storeNoMiddleware:dispatch({ type = "incrementB" })
				parameter.storeNoMiddleware:dispatch({ type = "incrementC" })
			end
		end,
	},
}
