import { createBroadcaster } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { slices } from "shared/slices";
import { producer } from "./";

const broadcaster = createBroadcaster({
	producers: slices,
	dispatch: (player, actions) => {
		remotes.dispatch.fire(player, actions);
	},
});

remotes.start.connect((player) => {
	broadcaster.start(player);
});

producer.applyMiddleware(broadcaster.middleware);
