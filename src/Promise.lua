local ReplicatedStorage = game:GetService("ReplicatedStorage")

export type PromiseStatus = "Started" | "Resolved" | "Rejected" | "Cancelled"

export type PromiseConstructor = {
	Status: {
		Started: "Started",
		Resolved: "Resolved",
		Rejected: "Rejected",
		Cancelled: "Cancelled",
	},
	new: <T>(
		resolver: (resolve: (T | Promise<T>) -> (), reject: (any) -> (), onCancel: (callback: () -> ()) -> ()) -> ()
	) -> Promise<T>,
	defer: <T>(
		resolver: (resolve: (T | Promise<T>) -> (), reject: (any) -> (), onCancel: (callback: () -> ()) -> ()) -> ()
	) -> Promise<T>,
	resolve: <T>(value: T | Promise<T>, ...any) -> Promise<T>,
	reject: (value: any) -> Promise<never>,
	try: <T, A...>(callback: (A...) -> T, A...) -> Promise<T>,
	all: <T>(promises: { Promise<T> }) -> Promise<{ T }>,
	fold: <T, U>(
		promises: { T | Promise<T> },
		reducer: (U, T, number) -> U | Promise<U>,
		initialValue: U
	) -> Promise<U>,
	some: <T>(promises: { Promise<T> }, count: number) -> Promise<{ T }>,
	any: <T>(promises: { Promise<T> }) -> Promise<T>,
	allSettled: (promises: { Promise<any> }) -> Promise<{ PromiseStatus }>,
	race: <T>(promises: { Promise<T> }) -> Promise<T>,
	each: <T, U>(list: { T | Promise<T> }, predicate: (T, number) -> U | Promise<U>) -> Promise<{ U }>,
	is: (value: any) -> boolean,
	promisify: <R, A...>(fn: (A...) -> R) -> (A...) -> Promise<R>,
	delay: (seconds: number) -> Promise<number>,
	fromEvent: <T>(event: RBXScriptSignal<T>, predicate: ((T) -> boolean)?) -> Promise<T>,
}

export type _Promise = {
	timeout: (self: _Promise, seconds: number, rejectionValue: unknown) -> _Promise,
	getStatus: (self: _Promise) -> PromiseStatus,
	andThen: (self: _Promise, successHandler: (...any) -> any, failureHandler: ((any) -> any)?) -> _Promise,
	catch: (self: _Promise, failureHandler: (...any) -> any) -> _Promise,
	tap: (self: _Promise, successHandler: (...any) -> ()) -> _Promise,
	andThenCall: <T...>(self: _Promise, successHandler: (T...) -> any, T...) -> _Promise,
	andThenReturn: (self: _Promise, value: any) -> _Promise,
	cancel: (self: _Promise) -> (),
	finally: (self: _Promise, callback: (status: PromiseStatus) -> any) -> _Promise,
	finallyCall: <T...>(self: _Promise, callback: (T...) -> any, T...) -> _Promise,
	finallyReturn: (self: _Promise, value: any) -> _Promise,
	awaitStatus: (self: _Promise) -> (PromiseStatus, ...any),
	await: (self: _Promise) -> (boolean, ...any),
	expect: (self: _Promise) -> ...any,
	now: (self: _Promise, rejectionValue: unknown) -> _Promise,
}

export type Promise<T... = ...any> = {
	timeout: (self: Promise<T...>, seconds: number, rejectionValue: unknown) -> Promise<T...>,
	getStatus: (self: Promise<T...>) -> PromiseStatus,
	andThen: (self: Promise<T...>, successHandler: (T...) -> (), failureHandler: ((...any) -> ())?) -> _Promise,
	catch: (self: Promise<T...>, failureHandler: (any) -> ()) -> Promise<T...>,
	tap: (self: Promise<T...>, successHandler: (T...) -> ()) -> Promise<T...>,
	andThenCall: <U...>(self: Promise<T...>, successHandler: (U...) -> (), U...) -> Promise<T...>,
	andThenReturn: (self: Promise<T...>, value: any) -> _Promise,
	cancel: (self: Promise<T...>) -> (),
	finally: (self: Promise<T...>, callback: (status: PromiseStatus) -> ()) -> _Promise,
	finallyCall: <U...>(self: Promise<T...>, callback: (U...) -> (), U...) -> _Promise,
	finallyReturn: (self: Promise<T...>, value: any) -> _Promise,
	awaitStatus: (self: Promise<T...>) -> (PromiseStatus, T...),
	await: (self: Promise<T...>) -> (boolean, T...),
	expect: (self: Promise<T...>) -> T...,
	now: (self: Promise<T...>, rejectionValue: unknown) -> Promise<T...>,
}

local include = script:FindFirstAncestor("rbxts_include")
	or ReplicatedStorage:FindFirstChild("rbxts_include")
	or script.Parent.Parent

if include and include:FindFirstChild("Promise") then
	return require(include.Promise) :: PromiseConstructor
else
	error(`Could not find Promise from {script:GetFullName()}`)
end
