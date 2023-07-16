import { createBroadcaster, loggerMiddleware } from "@rbxts/reflex";
import { sharedProducers } from "shared/producer";
import { server } from "shared/remotes";
import { producer } from "./";

const broadcaster = createBroadcaster({
	producers: sharedProducers,
	broadcast: (actionsByPlayer) => {
		for (const [player, actions] of actionsByPlayer) {
			server.Get("onServerDispatch").SendToPlayer(player, actions);
		}
	},
});

server.OnFunction("requestState", (player) => {
	return broadcaster.playerRequestedState(player);
});

producer.applyMiddleware(broadcaster.middleware, loggerMiddleware);
