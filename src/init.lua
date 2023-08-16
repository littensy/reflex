local types = require(script.types)
local broadcasting = require(script.broadcasting)

export type Producer<State = any, Dispatchers = { [string]: (...any) -> State }> = types.Producer<State, Dispatchers>
export type Middleware = types.Middleware

export type BroadcastAction = types.BroadcastAction
export type Broadcaster = types.Broadcaster
export type BroadcasterOptions = types.BroadcasterOptions
export type BroadcastReceiver = types.BroadcastReceiver
export type BroadcastReceiverOptions = types.BroadcastReceiverOptions

return {
	createProducer = require(script.createProducer),
	combineProducers = require(script.combineProducers),
	createSelector = require(script.createSelector),
	applyMiddleware = require(script.applyMiddleware),
	loggerMiddleware = require(script.middleware.loggerMiddleware),
	shallowEqual = require(script.utils.shallowEqual),
	createBroadcaster = broadcasting.createBroadcaster,
	createBroadcastReceiver = broadcasting.createReceiver,
}
