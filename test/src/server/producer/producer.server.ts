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
