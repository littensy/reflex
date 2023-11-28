return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local producer

	local function selector(state)
		return state
	end

	local function discriminator(item)
		return item.id
	end

	local function create(id)
		return { id = id }
	end

	local function hasId(items, id)
		for _, item in items do
			if item.id == id then
				return true
			end
		end

		return false
	end

	beforeEach(function()
		producer = createProducer({}, {})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should observe the initial items", function()
		local items = {}

		producer:setState({ create(1), create(2) })
		producer:flush()

		producer:observe(selector, discriminator, function(item)
			table.insert(items, item)
		end)

		expect(#items).to.equal(2)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(true)
	end)

	it("should observe additions", function()
		local items = {}

		producer:observe(selector, discriminator, function(item)
			table.insert(items, item)
		end)

		expect(#items).to.equal(0)

		producer:setState({ create(1), create(2) })
		producer:flush()

		expect(#items).to.equal(2)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(true)
	end)

	it("should observe additions to a set", function()
		local items = {}

		producer:observe(selector, function(_, key)
			return key
		end, function(_, key)
			table.insert(items, key)
		end)

		expect(#items).to.equal(0)

		producer:setState({ a = true, b = true })
		producer:flush()

		expect(#items).to.equal(2)
		expect(table.find(items, "a")).to.be.ok()
		expect(table.find(items, "b")).to.be.ok()
	end)

	it("should call the cleanup function when an item is deleted", function()
		local items = {}

		producer:setState({ create(1), create(2), create(3) })
		producer:flush()

		producer:observe(selector, discriminator, function(item)
			table.insert(items, item)
			return function()
				table.remove(items, table.find(items, item) or 0)
			end
		end)

		expect(#items).to.equal(3)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(true)
		expect(hasId(items, 3)).to.equal(true)

		producer:setState({ create(1), create(3) })
		producer:flush()

		expect(#items).to.equal(2)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(false)
		expect(hasId(items, 3)).to.equal(true)

		producer:setState({ create(3) })
		producer:flush()

		expect(#items).to.equal(1)
		expect(hasId(items, 1)).to.equal(false)
		expect(hasId(items, 2)).to.equal(false)
		expect(hasId(items, 3)).to.equal(true)

		producer:setState({})
		producer:flush()

		expect(#items).to.equal(0)
	end)

	it("should call the cleanup function when the observer is destroyed", function()
		local items = {}

		producer:setState({ create(1), create(2), create(3) })
		producer:flush()

		local unsubscribe = producer:observe(selector, discriminator, function(item)
			table.insert(items, item)
			return function()
				table.remove(items, table.find(items, item) or 0)
			end
		end)

		expect(#items).to.equal(3)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(true)
		expect(hasId(items, 3)).to.equal(true)

		unsubscribe()
		expect(#items).to.equal(0)
	end)

	it("should track objects with a discriminator", function()
		local items = {}
		local additions, deletions = 0, 0

		producer:observe(selector, discriminator, function(item)
			table.insert(items, item)
			additions += 1
			return function()
				table.remove(items, table.find(items, item) or 0)
				deletions += 1
			end
		end)

		expect(#items).to.equal(0)
		expect(additions).to.equal(0)
		expect(deletions).to.equal(0)

		producer:setState({ create(1), create(2), create(3), create(4), create(5) })
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(5)
		expect(deletions).to.equal(0)

		producer:setState({ create(5), create(4), create(3), create(2), create(1) })
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(5)
		expect(deletions).to.equal(0)
	end)

	it("should fail at tracking objects with no discriminator", function()
		local items = {}
		local additions, deletions = 0, 0

		producer:observe(selector, function(item)
			table.insert(items, item)
			additions += 1
			return function()
				table.remove(items, table.find(items, item) or 0)
				deletions += 1
			end
		end)

		expect(#items).to.equal(0)
		expect(additions).to.equal(0)
		expect(deletions).to.equal(0)

		producer:setState({ create(1), create(2), create(3), create(4), create(5) })
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(5)
		expect(deletions).to.equal(0)

		producer:setState({ create(5), create(4), create(3), create(2), create(1) })
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(10)
		expect(deletions).to.equal(5)
	end)

	it("should allow tracking objects by index", function()
		local items = {}
		local additions, deletions = 0, 0

		local function discriminator(item, index)
			return index
		end

		producer:observe(selector, discriminator, function(item, index)
			table.insert(items, item)
			additions += 1
			return function()
				table.remove(items, table.find(items, item) or 0)
				deletions += 1
			end
		end)

		producer:setState({ a = create(1), b = create(2), c = create(3) })
		producer:flush()

		expect(#items).to.equal(3)
		expect(additions).to.equal(3)
		expect(deletions).to.equal(0)

		producer:setState({ a = create(1), b = create(2), c = create(3), d = create(4) })
		producer:flush()

		expect(#items).to.equal(4)
		expect(additions).to.equal(4)
		expect(deletions).to.equal(0)

		producer:setState({ b = create(2), c = create(3), d = create(4) })
		producer:flush()

		expect(#items).to.equal(3)
		expect(additions).to.equal(4)
		expect(deletions).to.equal(1)
		expect(hasId(items, 1)).to.equal(false)
	end)

	it("should pass the index to the observer", function()
		local keys = {}

		producer:observe(selector, function(item, index)
			table.insert(keys, index)
		end)

		producer:setState({ a = 1, b = 2, c = 3 })
		producer:flush()

		expect(#keys).to.equal(3)

		expect(table.find(keys, "a")).to.be.ok()
		expect(table.find(keys, "b")).to.be.ok()
		expect(table.find(keys, "c")).to.be.ok()

		expect(table.find(keys, 1)).to.never.be.ok()
		expect(table.find(keys, 2)).to.never.be.ok()
		expect(table.find(keys, 3)).to.never.be.ok()
	end)
end
