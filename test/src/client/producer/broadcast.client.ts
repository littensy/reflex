import { createBroadcastReceiver } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { producer } from "./";

const receiver = createBroadcastReceiver({
	start: () => {
		remotes.start.fire();
	},
});

remotes.dispatch.connect((actions) => {
	receiver.dispatch(actions);
});

producer.applyMiddleware(receiver.middleware);
