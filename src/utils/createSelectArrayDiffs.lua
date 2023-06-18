local createSelector = require(script.Parent.Parent.createSelector)

type ArrayDiffs<T> = {
	additions: { T },
	deletions: { T },
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
local function createSelectArrayDiffs<State, Item>(
	selector: (state: State) -> Item,
	discriminator: ((item: Item) -> unknown)?
): (state: State) -> ArrayDiffs<Item>
	local lastIds = {}

	local selectItemMap = createSelector({ selector }, function(items)
		local map = {}

		for _, item in items do
			local key = if discriminator then discriminator(item) else item
			map[key] = item
		end

		return map
	end)

	return createSelector({ selectItemMap }, function(items)
		local additions = {}
		local deletions = {}

		for key, item in items do
			if lastIds[key] == nil then
				table.insert(additions, item)
			end
		end

		for key, item in lastIds do
			if items[key] == nil then
				table.insert(deletions, item)
			end
		end

		lastIds = items

		return {
			additions = additions,
			deletions = deletions,
		}
	end)
end

return createSelectArrayDiffs
