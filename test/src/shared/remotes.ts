import { BroadcastAction } from "@rbxts/reflex";
import { Client, Server, createRemotes, remote } from "@rbxts/remo";
import { SharedState } from "./slices";

export const remotes = createRemotes({
	dispatch: remote<Client, [actions: BroadcastAction[]]>(),
	hydrate: remote<Client, [state: SharedState]>(),
	start: remote<Server>(),
});
