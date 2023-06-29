local types = require(script.types)
local broadcast = require(script.broadcast)
local createProducer = require(script.createProducer)
local combineProducers = require(script.combineProducers)
local createSelector = require(script.createSelector)
local applyMiddleware = require(script.applyMiddleware)
local loggerMiddleware = require(script.middleware.loggerMiddleware)
local shallowEqual = require(script.utils.shallowEqual)

export type Broadcaster = types.Broadcaster
export type BroadcastAction = types.BroadcastAction
export type BroadcasterOptions = types.BroadcasterOptions

export type BroadcastReceiver = types.BroadcastReceiver
export type BroadcastReceiverOptions = types.BroadcastReceiverOptions

export type Producer<State = any, Dispatchers = { [string]: (...any) -> State }> = types.Producer<State, Dispatchers>
export type Middleware = types.Middleware

return {
	createProducer = createProducer,
	combineProducers = combineProducers,
	createSelector = createSelector,
	applyMiddleware = applyMiddleware,
	loggerMiddleware = loggerMiddleware,
	createBroadcaster = broadcast.createBroadcaster,
	createBroadcastReceiver = broadcast.createBroadcastReceiver,
	shallowEqual = shallowEqual,
}
