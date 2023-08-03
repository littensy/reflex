export type Producer<State = any, Dispatchers = { [string]: (...any) -> State }> = Dispatchers & {
	getState: (<Selection>(self: Producer<State, Dispatchers>, selector: ((state: State) -> any)?) -> State)
		& (<Selection>(self: Producer<State, Dispatchers>, selector: (state: State) -> Selection) -> Selection),

	setState: (self: Producer<State, Dispatchers>, state: State) -> (),

	resetState: (self: Producer<State, Dispatchers>) -> (),

	getDispatchers: (self: Producer<State, Dispatchers>) -> Dispatchers,

	getActions: (self: Producer<State, Dispatchers>) -> {
		[string]: (state: State, ...any) -> any,
	},

	flush: (self: Producer<State, Dispatchers>) -> (),

	subscribe: (<Selection>(
		self: Producer<State, Dispatchers>,
		listener: (state: State, prevState: State) -> ()
	) -> () -> ()) & (<Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> ()) & <Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		predicate: (state: Selection, prevState: Selection) -> boolean,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> (),

	once: (<Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> ()) & <Selection>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Selection,
		predicate: ((state: Selection, prevState: Selection) -> boolean)?,
		listener: (state: Selection, prevState: Selection) -> ()
	) -> () -> (),

	wait: <Selection>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Selection)?,
		predicate: ((state: Selection, prevState: Selection) -> boolean)?
	) -> any,

	observe: (<K, V>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> { [K]: V },
		discriminator: ((item: V, index: K) -> unknown)?,
		observer: (item: V, index: K) -> (() -> ())?
	) -> () -> ()) & (<K, V>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> { [K]: V },
		observer: (item: V, index: K) -> (() -> ())?
	) -> () -> ()),

	observeWhile: (<T>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> T,
		predicate: (state: T, prevState: T) -> boolean,
		observer: (state: T) -> (() -> ())?
	) -> () -> ()) & (<T>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> T?,
		observer: (state: T) -> (() -> ())?
	) -> () -> ()),

	destroy: (self: Producer<State, Dispatchers>) -> (),

	enhance: <Enhanced>(self: Producer<State, Dispatchers>, enhancer: (producer: any) -> Enhanced) -> Enhanced,

	applyMiddleware: (
		self: Producer<State, Dispatchers>,
		...(producer: any) -> (dispatch: (...any) -> any, name: string) -> (...any) -> any
	) -> Producer<State, Dispatchers>,
}

export type Middleware = (producer: Producer) -> (dispatch: (...any) -> any, name: string) -> (...any) -> any

export type ProducerMap = { [string]: Producer }

export type BroadcastAction = {
	name: string,
	arguments: { any },
}

export type BroadcasterOptions = {
	producers: ProducerMap,
	hydrateRate: number?,
	dispatchRate: number?,
	beforeDispatch: ((player: Player, action: BroadcastAction) -> BroadcastAction?)?,
	beforeHydrate: ((player: Player, state: { [string]: any }) -> { [string]: any })?,
	hydrate: ((player: Player, state: { [string]: any }) -> ())?,
	dispatch: (player: Player, actions: { BroadcastAction }) -> (),
}

export type Broadcaster = {
	middleware: Middleware,
	start: (self: Broadcaster, player: Player) -> (),
	destroy: (self: Broadcaster) -> (),
}

export type BroadcastReceiverOptions = {
	start: () -> any,
}

export type BroadcastReceiver = {
	middleware: Middleware,
	dispatch: (self: BroadcastReceiver, actions: { BroadcastAction }) -> (),
	hydrate: (self: BroadcastReceiver, state: { [string]: any }) -> (),
}

return nil
