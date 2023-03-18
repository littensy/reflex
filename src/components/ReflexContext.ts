import { createContext } from "@rbxts/roact";
import { Producer } from "../types";

export interface ReflexContextValue {
	producer: Producer<any, any>;
}

const ReflexContext = createContext<ReflexContextValue>({} as ReflexContextValue);

export default ReflexContext;
