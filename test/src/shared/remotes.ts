import Net from "@rbxts/net";
import { BroadcastActionContainer } from "@rbxts/reflex";
import { SharedState } from "./producer";

let definitions;

if (game.GetService("RunService").IsRunning()) {
	definitions = Net.CreateDefinitions({
		getServerState: Net.Definitions.ServerAsyncFunction<() => SharedState>(),
		broadcastDispatcher: Net.Definitions.ServerToClientEvent<[action: BroadcastActionContainer[]]>(),
	});
} else {
	definitions = { Client: {}, Server: {} } as never;
	warn("Remotes were imported from a Hoarcekat story.");
}

export const { Client: client, Server: server } = definitions;
