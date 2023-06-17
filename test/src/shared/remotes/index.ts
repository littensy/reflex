import { RunService } from "@rbxts/services";

/**
 * Prevent Net from being imported outside of a running game.
 */
async function getRemotes() {
	if (RunService.IsStudio() && !RunService.IsRunning()) {
		return { client: {}, server: {} } as never;
	}

	return await import("./remotes");
}

export const { client, server } = getRemotes().expect();
