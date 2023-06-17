local TS = require(game:GetService("ReplicatedStorage").rbxts_include.RuntimeLib)
local Reflex = TS.import(script, game:GetService("ReplicatedStorage"), "reflex")
local Roselect = TS.import(
	script,
	game:GetService("ReplicatedStorage"),
	"rbxts_include",
	"node_modules",
	"@rbxts",
	"roselect",
	"src"
)

--[[
	Benchmarker

	Device: MacBook Pro (M1 Pro, 16-inch, 2021)
	Run type: Time
	Run time: 1 second

	Times

	Reflex.createSelector:   40 microseconds
	- compare deps:          25 microseconds
	- compare dep params:    5 microseconds
	Roselect.createSelector: 65 microseconds
	- compare deps:          40 microseconds
	- compare dep params:    10 microseconds

	Summary

	Reflex is faster than Roselect for a simple selector by roughly 40%. Most of
	the time saved is from faster dependency and parameter comparison.
]]

return {
	ParameterGenerator = function()
		local names = {}
		local ids = {}

		for i = 1, 200 do
			names[i] = "Name " .. math.random()
			ids[i] = "Id " .. math.random()
		end

		return {
			state1 = {
				names = names,
				ids = ids,
			},
			state2 = {
				names = table.clone(names),
				ids = table.clone(ids),
			},
			reflexSelector = Reflex.createSelector({
				function(state)
					return state.names
				end,
				function(state)
					return state.ids
				end,
			}, function(names, ids)
				local namesByIds = {}
				for _, id in ids do
					namesByIds[id] = names[id]
				end
				return namesByIds
			end),
			roselectSelector = Roselect.createSelector({
				function(state)
					return state.names
				end,
				function(state)
					return state.ids
				end,
			}, function(names, ids)
				local namesByIds = {}
				for _, id in ids do
					namesByIds[id] = names[id]
				end
				return namesByIds
			end),
		}
	end,

	Functions = {
		["Reflex.createSelector"] = function(profiler, parameter)
			profiler.Begin("compute")
			parameter.reflexSelector(table.clone(parameter.state1))
			profiler.End()

			profiler.Begin("compare deps")
			for _ = 1, 50 do
				parameter.reflexSelector(table.clone(parameter.state1))
			end
			profiler.End()

			profiler.Begin("compute")
			parameter.reflexSelector(table.clone(parameter.state2))
			profiler.End()

			profiler.Begin("compare dep params")
			for _ = 1, 50 do
				parameter.reflexSelector(parameter.state2)
			end
			profiler.End()
		end,

		["Roselect.createSelector"] = function(profiler, parameter)
			profiler.Begin("compute")
			parameter.roselectSelector(table.clone(parameter.state1))
			profiler.End()

			profiler.Begin("compare deps")
			for _ = 1, 50 do
				parameter.roselectSelector(table.clone(parameter.state1))
			end
			profiler.End()

			profiler.Begin("compute")
			parameter.roselectSelector(table.clone(parameter.state2))
			profiler.End()

			profiler.Begin("compare dep params")
			for _ = 1, 50 do
				parameter.roselectSelector(parameter.state2)
			end
			profiler.End()
		end,
	},
}
