local packages = script:FindFirstAncestor("rbxts_include") or script.Parent.Parent

if packages and packages:FindFirstChild("Promise") then
	return require(packages.Promise)
else
	error(`Could not find Promise from {script:GetFullName()}`)
end
