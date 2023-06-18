return function()
	local createProducer = require(script.Parent.Parent.createProducer)

	local producer

	local function selector(state)
		return state
	end

	local function discriminator(item)
		return item.id
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
		producer = createProducer({}, {
			add = function(state, id)
				local nextState = table.clone(state)
				nextState[`item-{id}`] = { id = id }
				return nextState
			end,

			remove = function(state, id)
				local nextState = {}
				for key, item in state do
					if item.id ~= id then
						nextState[key] = item
					end
				end
				return nextState
			end,

			move = function(state)
				local nextState = {}
				for key, item in state do
					nextState[`{key}-up`] = { id = item.id }
				end
				return nextState
			end,
		})
	end)

	afterEach(function()
		producer:destroy()
	end)

	it("should observe the initial items", function()
		local items = {}

		producer.add(1)
		producer.add(2)
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

		producer.add(1)
		producer.add(2)
		producer:flush()

		expect(#items).to.equal(2)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(true)
	end)

	it("should call the cleanup function when an item is deleted", function()
		local items = {}

		for i = 1, 3 do
			producer.add(i)
		end
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

		producer.remove(2)
		producer:flush()

		expect(#items).to.equal(2)
		expect(hasId(items, 1)).to.equal(true)
		expect(hasId(items, 2)).to.equal(false)
		expect(hasId(items, 3)).to.equal(true)

		producer.remove(1)
		producer:flush()

		expect(#items).to.equal(1)
		expect(hasId(items, 1)).to.equal(false)
		expect(hasId(items, 2)).to.equal(false)
		expect(hasId(items, 3)).to.equal(true)

		producer.remove(3)
		producer:flush()

		expect(#items).to.equal(0)
	end)

	it("should call the cleanup function when the observer is destroyed", function()
		local items = {}

		for i = 1, 3 do
			producer.add(i)
		end
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

		for i = 1, 5 do
			producer.add(i)
		end
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(5)
		expect(deletions).to.equal(0)

		producer.move()
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

		for i = 1, 5 do
			producer.add(i)
		end
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(5)
		expect(deletions).to.equal(0)

		producer.move()
		producer:flush()

		expect(#items).to.equal(5)
		expect(additions).to.equal(10)
		expect(deletions).to.equal(5)
	end)
end
