import { applyMiddleware, createBroadcaster, loggerMiddleware } from "@rbxts/reflex";
import { sharedProducers } from "shared/producer";
import { server } from "shared/remotes";
import { producer } from "./producer";

const broadcaster = createBroadcaster({
	producers: sharedProducers,
	broadcast: (players, actions) => {
		server.Get("broadcastDispatcher").SendToPlayers(players, actions);
	},
});

server.OnFunction("getServerState", (player) => {
	return broadcaster.playerRequestedState(player);
});

producer.enhance(applyMiddleware(broadcaster.middleware, loggerMiddleware));

// Playing around with syncing shared dispatchers with the client
task.delay(3, () => {
	// producer.incrementShared();
	// producer.multiplyShared(5);
});
