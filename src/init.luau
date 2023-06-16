local broadcast = require(script.broadcast)
local createProducer = require(script.createProducer)
local combineProducers = require(script.combineProducers)
local createSelector = require(script.createSelector)
local applyMiddleware = require(script.applyMiddleware)

export type Broadcaster = broadcast.Broadcaster
export type BroadcastAction = broadcast.BroadcastAction
export type BroadcasterOptions = broadcast.BroadcasterOptions

export type BroadcastReceiver = broadcast.BroadcastReceiver
export type BroadcastReceiverOptions = broadcast.BroadcastReceiverOptions

export type Producer<State, Dispatchers = { [string]: (...any) -> State }> = createProducer.Producer<State, Dispatchers>
export type Middleware = applyMiddleware.Middleware

return {
	createProducer = createProducer,
	combineProducers = combineProducers,
	createSelector = createSelector,
	applyMiddleware = applyMiddleware,
	createBroadcaster = broadcast.createBroadcaster,
	createBroadcastReceiver = broadcast.createBroadcastReceiver,
}
