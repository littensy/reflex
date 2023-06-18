import { createProducer } from "@rbxts/reflex";

interface Item {
	readonly id: number;
	readonly name: string;
}

interface ItemState {
	readonly list: readonly Item[];
	readonly map: {
		readonly [id: number]: Item;
	};
}

const initialState: ItemState = { list: [], map: {} };

const producer = createProducer(initialState, {
	add: (state, item: Item) => ({
		list: [...state.list, item],
		map: { ...state.map, [item.id]: item },
	}),

	remove: (state, id: number) => ({
		list: state.list.filter((item) => item.id !== id),
		map: { ...state.map, [id]: undefined! },
	}),

	rename: (state, id: number, name: string) => ({
		list: state.list.map((item) => (item.id === id ? { ...item, name } : item)),
		map: { ...state.map, [id]: { ...state.map[id], name } },
	}),
});

producer.observe(
	(state) => state.list,
	(item) => item.id,
	(item) => {
		print("Item added:", item);
		return () => print("Item removed:", item);
	},
);

producer.observe(
	(state) => state.map,
	(item) => item.id,
	(item) => {
		print("Item added:", item);
		return () => print("Item removed:", item);
	},
);
