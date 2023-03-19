import { ReflexProvider, useSelector } from "@rbxts/reflex";
import Roact from "@rbxts/roact";
import { withHookDetection } from "@rbxts/roact-hooked";
import { useAppProducer } from "../hooks/use-app-producer";
import { producer } from "../producer";
import { selectClientCount } from "../producer/client-counter.producer";

function Counter() {
	const { incrementClient } = useAppProducer();

	const count = useSelector(selectClientCount);

	return (
		<textbutton
			Text={`Count: ${count}`}
			Event={{ Activated: incrementClient }}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Position={new UDim2(0.5, 0, 0.5, 0)}
			Size={new UDim2(0, 100, 0, 50)}
		/>
	);
}

export = (target: Frame) => {
	withHookDetection(Roact);

	const tree = Roact.mount(
		<ReflexProvider producer={producer}>
			<Counter />
		</ReflexProvider>,
		target,
	);

	return () => {
		Roact.unmount(tree);
	};
};
