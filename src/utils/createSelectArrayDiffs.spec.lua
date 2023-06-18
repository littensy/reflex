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

	it("should return initial additions and deletions", function()
		local selector = createSelectArrayDiffs(forward)
		local diffs = selector({ 1, 2, 3 })
		expect(diffs.additions).to.be.a("table")
		expect(diffs.deletions).to.be.a("table")
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)
	end)

	it("should track additions", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ 1, 2, 3 })
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)
		expect(diffs.additions[1]).to.equal(1)
		expect(diffs.additions[2]).to.equal(2)
		expect(diffs.additions[3]).to.equal(3)

		diffs = selector({ 1, 2, 3, 4 })
		expect(#diffs.additions).to.equal(1)
		expect(#diffs.deletions).to.equal(0)
		expect(diffs.additions[1]).to.equal(4)
	end)

	it("should track deletions", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ 1, 2, 3 })
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)

		diffs = selector({ 1, 3 })
		expect(#diffs.additions).to.equal(0)
		expect(#diffs.deletions).to.equal(1)
		expect(diffs.deletions[1]).to.equal(2)
	end)

	it("should track additions and deletions simultaneously", function()
		local selector = createSelectArrayDiffs(forward)

		local diffs = selector({ 1, 2, 3 })
		expect(#diffs.additions).to.equal(3)
		expect(#diffs.deletions).to.equal(0)

		diffs = selector({ 1, 3, 4 })
		expect(#diffs.additions).to.equal(1)
		expect(#diffs.deletions).to.equal(1)
		expect(diffs.additions[1]).to.equal(4)
		expect(diffs.deletions[1]).to.equal(2)
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
end
