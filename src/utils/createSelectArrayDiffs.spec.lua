return function()
	local createSelectArrayDiffs = require(script.Parent.createSelectArrayDiffs)

	local function forward(state)
		return state
	end

	local function discriminator(item)
		return item.id
	end

	local function new(id)
		return { id = id }
	end

	local function hasEntry(items, id, key)
		for _, item in ipairs(items) do
			if item.id == id and (key == nil or key == item.key) then
				return true
			end
		end

		return false
	end

	it("should return initial additions and deletions", function()
		local selector = createSelectArrayDiffs(forward)
		local diffs = selector({ 1, 2, 3 })
		expect(diffs.additions).to.be.a("table")
		expect(diffs.deletions).to.be.a("table")
		expect(hasEntry(diffs.additions, 1)).to.equal(true)
		expect(hasEntry(diffs.additions, 2)).to.equal(true)
		expect(hasEntry(diffs.additions, 3)).to.equal(true)
		expect(#diffs.deletions).to.equal(0)
	end)

	it("should track additions and deletions", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ a = 1, b = 2, c = 3 })
		expect(hasEntry(diffs.additions, 1, "a")).to.equal(true)
		expect(hasEntry(diffs.additions, 2, "b")).to.equal(true)
		expect(hasEntry(diffs.additions, 3, "c")).to.equal(true)
		expect(#diffs.deletions).to.equal(0)

		diffs = selector({ a = 1, x = 10, c = 3 })
		expect(hasEntry(diffs.additions, 10, "x")).to.equal(true)
		expect(hasEntry(diffs.deletions, 2, "b")).to.equal(true)
	end)

	it("should receive a discriminator parameter", function()
		local selector = createSelectArrayDiffs(forward, discriminator)

		local diffs = selector({ new(1), new(2), new(3) })
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)
		expect(diffs.additions[1].value.id).to.equal(1)
		expect(diffs.additions[2].value.id).to.equal(2)
		expect(diffs.additions[3].value.id).to.equal(3)

		diffs = selector({ new(1), new(3), new(4) })
		expect(#diffs.additions).to.equal(1)
		expect(#diffs.deletions).to.equal(1)
		expect(diffs.additions[1].value.id).to.equal(4)
		expect(diffs.deletions[1].value.id).to.equal(2)
	end)

	it("should track new items with the same discriminator", function()
		local selector = createSelectArrayDiffs(forward, discriminator)

		local diffs = selector({ new(1), new(2), new(3) })
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)

		diffs = selector({ new(1), new(2), new(3) })
		expect(#diffs.additions).to.equal(0)
		expect(#diffs.deletions).to.equal(0)
	end)

	it("should allow tracking items by index", function()
		local function discriminator(item, index)
			return index
		end

		local selector = createSelectArrayDiffs(forward, discriminator)

		local diffs = selector({ 1, 2, 3 })
		expect(hasEntry(diffs.additions, 1, 1)).to.equal(true)
		expect(hasEntry(diffs.additions, 2, 2)).to.equal(true)
		expect(hasEntry(diffs.additions, 3, 3)).to.equal(true)

		diffs = selector({ 1, 2, 3, 4 })
		expect(hasEntry(diffs.additions, 4, 4)).to.equal(true)
		expect(#diffs.deletions).to.equal(0)

		-- removing the fourth item should trigger a deletion of 4
		-- because that index is no longer in the array
		diffs = selector({ 1, 3, 4 })
		expect(hasEntry(diffs.deletions, 4, 4)).to.equal(true)
		expect(#diffs.additions).to.equal(0)
	end)

	it("should pass the correct index", function()
		local keys = {}

		local function discriminator(item, index)
			table.insert(keys, index)
			return index
		end

		local selector = createSelectArrayDiffs(forward, discriminator)

		selector({ a = 1, b = 2, c = 3 })
		selector({})

		expect(table.find(keys, "a")).to.be.ok()
		expect(table.find(keys, "b")).to.be.ok()
		expect(table.find(keys, "c")).to.be.ok()

		expect(table.find(keys, 1)).to.never.be.ok()
		expect(table.find(keys, 2)).to.never.be.ok()
		expect(table.find(keys, 3)).to.never.be.ok()
	end)
end
