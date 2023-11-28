--!strict
local createSelector = require(script.Parent.Parent.createSelector)

type ArrayDiffs<K, V> = {
	additions: { Entry<K, V> },
	deletions: { Entry<K, V> },
}

type Entry<K, V> = {
	key: K,
	value: V,
	id: unknown,
}

--[=[
	Tracks the addition and removal of items in an array. Creates a selector that
	returns an object containing the additions and deletions since the last update.

	If your array contains immutable objects, you can use the `discriminator`
	argument to return a unique identifier for each item. This prevents excessive
	re-renders when an item is updated but not added or removed.

	@param selector The selector to track.
	@param discriminator A function that returns a unique identifier for each
	item. Useful when tracking immutable objects.
	@returns A selector that returns an object containing the additions and
	deletions since the last update.
]=]
local function createSelectArrayDiffs<State, K, V>(
	selector: (state: State) -> { [K]: V },
	discriminator: ((item: V, index: K) -> unknown)?
): (state: State) -> ArrayDiffs<K, V>
	local lastEntries: { [unknown]: Entry<K, V> } = {}

	return createSelector(selector, function(items: { [K]: V })
		local additions: { Entry<K, V> } = {}
		local deletions: { Entry<K, V> } = {}
		local entries: { [unknown]: Entry<K, V> } = {}

		for key, item in items do
			local id = if discriminator then discriminator(item, key) else item
			local entry = { key = key, value = item, id = id }

			assert(id ~= nil, "Discriminator returned a nil value")

			if not lastEntries[id] then
				table.insert(additions, entry)
			end

			entries[id] = entry
		end

		for id, item in lastEntries do
			if not entries[id] then
				local entry = lastEntries[id]
				table.insert(deletions, entry)
			end
		end

		lastEntries = entries

		return {
			additions = additions,
			deletions = deletions,
		}
	end)
end

return createSelectArrayDiffs
