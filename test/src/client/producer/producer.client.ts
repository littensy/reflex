import { createBroadcastReceiver, loggerMiddleware } from "@rbxts/reflex";
import { client } from "shared/remotes";
import { producer } from "./";

const receiver = createBroadcastReceiver({
	requestState: async () =>
		client
			.Get("requestState")
			.CallServerAsync()
			.tap((state) => print("[example.client]: Server state received:", state)),
});

client.OnEvent("onServerDispatch", (actions) => {
	receiver.dispatch(actions);
});

producer.applyMiddleware(receiver.middleware, loggerMiddleware);
