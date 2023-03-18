import Roact from "@rbxts/roact";
import { useMemo } from "@rbxts/roact-hooked";
import { Producer } from "../types";
import ReflexContext from "./ReflexContext";

interface ReflexProviderProps<S> extends Roact.PropsWithChildren {
	/**
	 * The single Producer in your client.
	 */
	producer: Producer<S, any>;

	/**
	 * An optional state snapshot. Will be used to hydrate the state of the
	 * producer during the first render.
	 */
	initialState?: Partial<S>;
}

export default function ReflexProvider<S>({
	producer,
	initialState,
	[Roact.Children]: children,
}: ReflexProviderProps<S>) {
	const contextValue = useMemo(() => {
		producer.setState({
			...producer.getState(),
			initialState,
		});

		return { producer };
	}, [producer]);

	return <ReflexContext.Provider value={contextValue}>{children}</ReflexContext.Provider>;
}
