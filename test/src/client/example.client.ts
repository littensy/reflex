import { createBroadcastReceiver } from "@rbxts/reflex";
import { client } from "shared/remotes";
import { producer } from "./producer";

const broadcastReceiver = createBroadcastReceiver({
	getServerState: () =>
		client
			.WaitFor("getServerState")
			.then((remote) => remote.CallServerAsync())
			.tap((state) => print("[example.client]: Server state received:", state)),
});

client.OnEvent("broadcastDispatcher", (actions) => {
	broadcastReceiver.dispatch(actions);
});

producer.enhance(broadcastReceiver.enhancer);
