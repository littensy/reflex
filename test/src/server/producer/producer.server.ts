import { createBroadcaster, loggerMiddleware } from "@rbxts/reflex";
import { sharedProducers } from "shared/producer";
import { server } from "shared/remotes";
import { producer } from "./";

const broadcaster = createBroadcaster({
	producers: sharedProducers,
	broadcast: (players, actions) => {
		server.Get("onServerDispatch").SendToPlayers(players, actions);
	},
});

server.OnFunction("requestState", (player) => {
	return broadcaster.playerRequestedState(player);
});

producer.applyMiddleware(broadcaster.middleware, loggerMiddleware);

// Playing around with syncing shared dispatchers with the client
// loggerMiddleware should end with the same state on client and server

for (const _ of $range(1, 30)) {
	task.wait(math.random() - 0.5);
	producer.incrementShared();
	task.wait(math.random() - 0.5);
	producer.multiplyShared(math.random() * 5);
}
