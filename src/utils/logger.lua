local RunService = game:GetService("RunService")

local IS_DEV = RunService:IsStudio()

local function logWarning(...: unknown)
	if IS_DEV then
		warn("[Reflex]", ...)
	end
end

local function logError(message: unknown, level: number?)
	if IS_DEV then
		error(`[Reflex] {message}`, if level then level + 1 else 2)
	end
end

return {
	warn = logWarning,
	error = logError,
}
