local createBroadcaster = require(script.broadcaster)
local createBroadcastReceiver = require(script.broadcastReceiver)

return {
	createBroadcaster = createBroadcaster,
	createBroadcastReceiver = createBroadcastReceiver,
}
