return function()
	local createSelectArrayDiffs = require(script.Parent.createSelectArrayDiffs)
	local shallowEqual = require(script.Parent.shallowEqual)

	local function forward(state)
		return state
	end

	local function discriminator(item)
		return item.id
	end

	local function new(id)
		return { id = id }
	end

	it("should return initial additions and deletions", function()
		local selector = createSelectArrayDiffs(forward)
		local diffs = selector({ 1, 2, 3 })
		expect(diffs.additions).to.be.a("table")
		expect(diffs.deletions).to.be.a("table")
		expect(shallowEqual(diffs.additions, { 1, 2, 3 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)
		expect(shallowEqual(diffs.keys, { 1, 2, 3 })).to.equal(true)
	end)

	it("should provide the keys of additions and deletions", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ a = 1, b = 2, c = 3 })
		table.sort(diffs.additions) -- order is not guaranteed
		expect(shallowEqual(diffs.additions, { 1, 2, 3 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)
		expect(shallowEqual(diffs.keys, { "a", "b", "c" })).to.equal(true)

		diffs = selector({ a = 1, x = 10, c = 3 })
		expect(shallowEqual(diffs.additions, { 10 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, { 2 })).to.equal(true)
		expect(shallowEqual(diffs.keys, { [10] = "x", [2] = "b" })).to.equal(true)
	end)

	it("should track additions", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ 1, 2, 3 })
		expect(shallowEqual(diffs.additions, { 1, 2, 3 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)

		diffs = selector({ 1, 2, 3, 4 })
		expect(shallowEqual(diffs.additions, { 4 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)
	end)

	it("should track deletions", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ 1, 2, 3 })
		expect(shallowEqual(diffs.additions, { 1, 2, 3 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)

		diffs = selector({ 1, 3 })
		expect(shallowEqual(diffs.additions, {})).to.equal(true)
		expect(shallowEqual(diffs.deletions, { 2 })).to.equal(true)
	end)

	it("should track additions and deletions simultaneously", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ 1, 2, 3 })
		expect(shallowEqual(diffs.additions, { 1, 2, 3 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)

		diffs = selector({ 1, 3, 4 })
		expect(shallowEqual(diffs.additions, { 4 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, { 2 })).to.equal(true)
	end)

	it("should receive a discriminator parameter", function()
		local selector = createSelectArrayDiffs(forward, discriminator)

		local diffs = selector({ new(1), new(2), new(3) })
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)
		expect(diffs.additions[1].id).to.equal(1)
		expect(diffs.additions[2].id).to.equal(2)
		expect(diffs.additions[3].id).to.equal(3)

		diffs = selector({ new(1), new(3), new(4) })
		expect(#diffs.additions).to.equal(1)
		expect(#diffs.deletions).to.equal(1)
		expect(diffs.additions[1].id).to.equal(4)
		expect(diffs.deletions[1].id).to.equal(2)
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
		expect(shallowEqual(diffs.additions, { 1, 2, 3 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)

		diffs = selector({ 1, 2, 3, 4 })
		expect(shallowEqual(diffs.additions, { 4 })).to.equal(true)
		expect(shallowEqual(diffs.deletions, {})).to.equal(true)

		-- removing the fourth item should trigger a deletion of 4
		-- because that index is no longer in the array
		diffs = selector({ 1, 3, 4 })
		expect(shallowEqual(diffs.additions, {})).to.equal(true)
		expect(shallowEqual(diffs.deletions, { 4 })).to.equal(true)
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
