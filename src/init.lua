local types = require(script.types)

export type Producer<State = any, Dispatchers = { [string]: (...any) -> State }> = types.Producer<State, Dispatchers>
export type Middleware = types.Middleware

export type BroadcastAction = types.BroadcastAction
export type Broadcaster = types.Broadcaster
export type BroadcasterOptions = types.BroadcasterOptions
export type BroadcastReceiver = types.BroadcastReceiver
export type BroadcastReceiverOptions = types.BroadcastReceiverOptions

return {}
