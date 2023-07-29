import { createBroadcaster } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { slices } from "shared/slices";
import { producer } from "./";

const broadcaster = createBroadcaster({
	producers: slices,
	dispatchRate: 1 / 20,
	dispatch: (player, actions) => {
		remotes.dispatch.fire(player, actions);
	},
	hydrate: (player, state) => {
		remotes.hydrate.fire(player, state);
	},
});

remotes.start.connect((player) => {
	broadcaster.start(player);
});

producer.applyMiddleware(broadcaster.middleware);
