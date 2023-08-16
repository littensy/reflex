local Promise = require(script.Parent.Promise)

export type Cleanup = () -> ()

type NotCallable<T> = T | (() -> ())

export type Producer<State = any, Dispatchers = { [any]: any }> = Dispatchers & {
	getState: (<Result>(self: Producer<State, Dispatchers>) -> State)
		& (<Result>(self: Producer<State, Dispatchers>, selector: (state: State) -> Result) -> Result)
		& (<Result>(self: Producer<State, Dispatchers>, selector: ((state: State) -> Result)?) -> Result | State),

	setState: (self: Producer<State, Dispatchers>, state: State) -> (),

	resetState: (self: Producer<State, Dispatchers>) -> (),

	getDispatchers: (self: Producer<State, Dispatchers>) -> Dispatchers,

	getActions: (self: Producer<State, Dispatchers>) -> {
		[string]: (state: State, ...any) -> any,
	},

	flush: (self: Producer<State, Dispatchers>) -> (),

	subscribe: (<Result>(
		self: Producer<State, Dispatchers>,
		listener: (state: State, prevState: State) -> ()
	) -> Cleanup) & (<Result>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Result)?,
		listener: (state: Result, prevState: Result) -> ()
	) -> Cleanup) & <Result>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Result)?,
		predicate: ((state: Result, prevState: Result) -> boolean)?,
		listener: (state: Result, prevState: Result) -> ()
	) -> Cleanup,

	once: (<Result>(
		self: Producer<State, Dispatchers>,
		listener: (state: Result, prevState: Result) -> ()
	) -> Cleanup) & (<Result>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Result)?,
		listener: (state: Result, prevState: Result) -> ()
	) -> Cleanup) & <Result>(
		self: Producer<State, Dispatchers>,
		selector: ((state: State) -> Result)?,
		predicate: ((state: Result, prevState: Result) -> boolean)?,
		listener: (state: Result, prevState: Result) -> ()
	) -> Cleanup,

	wait: <Result>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> Result,
		predicate: ((state: Result, prevState: Result) -> boolean)?
	) -> Promise.Promise<Result>,

	observe: (<K, V>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> { [K]: V },
		discriminator: ((item: V, index: K) -> unknown)?,
		observer: (item: V, index: K) -> Cleanup?
	) -> Cleanup) & (<K, V>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> { [K]: V },
		observer: (item: V, index: K) -> Cleanup?
	) -> Cleanup),

	observeWhile: (<T>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> T,
		predicate: (state: T, prevState: T) -> boolean,
		observer: (state: T) -> Cleanup?
	) -> Cleanup) & (<T>(
		self: Producer<State, Dispatchers>,
		selector: (state: State) -> T?,
		observer: (state: T) -> Cleanup?
	) -> Cleanup),

	destroy: (self: Producer<State, Dispatchers>) -> (),

	enhance: <Enhanced>(self: Producer<State, Dispatchers>, enhancer: (producer: any) -> Enhanced) -> Enhanced,

	applyMiddleware: (
		self: Producer<State, Dispatchers>,
		...(producer: any) -> (dispatch: (...any) -> any, name: string) -> (...any) -> any
	) -> Producer<State, Dispatchers>,

	Connect: NotCallable<(self: Producer<State, Dispatchers>, listener: (state: State) -> ()) -> RBXScriptConnection>,

	Once: NotCallable<(self: Producer<State, Dispatchers>, listener: (state: State) -> ()) -> RBXScriptConnection>,

	Wait: NotCallable<(self: Producer<State, Dispatchers>) -> State>,
}

export type Middleware = (producer: Producer) -> (dispatch: (...any) -> any, name: string) -> (...any) -> any

export type ProducerSlices = { [string]: Producer }

export type BroadcastAction = {
	name: string,
	arguments: { any },
}

export type BroadcasterOptions = {
	producers: ProducerSlices,
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
	flush: (self: Broadcaster) -> (),
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
