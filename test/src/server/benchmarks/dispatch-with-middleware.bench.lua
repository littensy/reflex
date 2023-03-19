local TS = require(game:GetService("ReplicatedStorage").include.RuntimeLib)
local Reflex = TS.import(script, game:GetService("ReplicatedStorage"), "reflex")
local Rodux =
	TS.import(script, game:GetService("ReplicatedStorage"), "include", "node_modules", "@rbxts", "rodux", "src")

--[[
	Benchmarker

	Run type: Time
	Run time: 1 second

	Reflex no middleware: 95 microseconds
	Reflex middleware:    130 microseconds
	Rodux no middleware:  200 microseconds
	Rodux middleware:     220 microseconds

	Reflex tends to be 40% faster than Rodux, but middleware adds a 30% overhead.
]]

return {
	ParameterGenerator = function()
		local function reflexMiddleware(dispatch, resolve, producer)
			return function(...)
				return dispatch(...)
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
			}):enhance(Reflex.applyMiddleware(reflexMiddleware)),

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
