local RunService = game:GetService("RunService")

local function setInterval(callback: () -> (), interval: number)
	if interval < 0 then
		return
	end

	local timer = 0
	local connection

	connection = RunService.Heartbeat:Connect(function(dt)
		timer += dt

		if timer >= interval then
			timer = 0
			callback()
		end
	end)

	return function()
		connection:Disconnect()
	end
end

return setInterval
