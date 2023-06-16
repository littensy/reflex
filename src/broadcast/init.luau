local createBroadcaster = require(script.broadcaster)
local createBroadcastReceiver = require(script.broadcastReceiver)

export type Broadcaster = createBroadcaster.Broadcaster
export type BroadcastAction = createBroadcaster.BroadcastAction
export type BroadcasterOptions = createBroadcaster.BroadcasterOptions

export type BroadcastReceiver = createBroadcastReceiver.BroadcastReceiver
export type BroadcastReceiverOptions = createBroadcastReceiver.BroadcastReceiverOptions

return {
	createBroadcaster = createBroadcaster,
	createBroadcastReceiver = createBroadcastReceiver,
}
