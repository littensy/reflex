local createSelector = require(script.Parent.Parent.createSelector)

type ChangeDescription<K, V> = {
	additions: { V },
	deletions: { V },
	keys: { [V]: K },
}

type Entry<K, V> = {
	key: K,
	value: V,
}

local function createChangeSelector<State, K, V>(
	selector: (state: State) -> { [K]: V },
	discriminator: ((item: V, index: K) -> unknown)?
): (state: State) -> ChangeDescription<K, V>
	local lastEntries: { [unknown]: Entry<K, V> } = {}

	return createSelector(selector, function(items)
		local additions: { V } = {}
		local deletions: { V } = {}
		local keys: { [V]: K } = {}
		local entries: { [unknown]: Entry<K, V> } = {}

		for key, item in items do
			local id = if discriminator then discriminator(item, key) else item

			assert(id ~= nil, "Discriminator returned a nil value")

			if not lastEntries[id] then
				keys[item] = key
				table.insert(additions, item)
			end

			entries[id] = { key = key, value = item }
		end

		for id, item in lastEntries do
			if not entries[id] then
				local entry = lastEntries[id]
				keys[entry.value] = entry.key
				table.insert(deletions, entry.value)
			end
		end

		lastEntries = entries

		return {
			additions = additions,
			deletions = deletions,
			keys = keys,
		}
	end)
end

return createChangeSelector
