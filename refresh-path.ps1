# Refresh PATH and set execution policy for current session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

Write-Host "PATH refreshed and execution policy set for this session" -ForegroundColor Green
Write-Host "You can now use npm and node commands" -ForegroundColor Green

