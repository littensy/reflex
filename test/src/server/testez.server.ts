import TestEZ from "@rbxts/testez";

TestEZ.TestBootstrap.run(
	[game.GetService("ReplicatedStorage").FindFirstChild("reflex")!],
	TestEZ.Reporters.TextReporter,
);
