import { CreateDefinitions, Definitions } from "@rbxts/net";
import { BroadcastAction } from "@rbxts/reflex";
import { SharedState } from "shared/producer";

export const definitions = CreateDefinitions({
	requestState: Definitions.ServerAsyncFunction<() => SharedState>(),
	onServerDispatch: Definitions.ServerToClientEvent<[actions: BroadcastAction[]]>(),
});

export const { Client: client, Server: server } = definitions;
