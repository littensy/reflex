import { ReflexProvider, useSelector } from "@rbxts/reflex";
import Roact from "@rbxts/roact";
import { withHookDetection } from "@rbxts/roact-hooked";
import { useAppProducer } from "../hooks/use-app-producer";
import { producer } from "../producer";
import { selectCount } from "../producer/counter.producer";

function Counter() {
	const { increment } = useAppProducer();

	const count = useSelector(selectCount);

	return (
		<textbutton
			Text={`Count: ${count}`}
			Event={{ Activated: increment }}
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
