# Start Backend and Frontend Servers
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CTC-ERP System - Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendPath = "c:\Users\Koncept Solutions\Desktop\CTC-ERP system\backend"
$frontendPath = "c:\Users\Koncept Solutions\Desktop\CTC-ERP system\frontend"

# Start Backend Server
Write-Host "Starting BACKEND server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND SERVER ===' -ForegroundColor Cyan; Write-Host 'Port: 5000' -ForegroundColor Green; Write-Host ''; npm run dev"

Start-Sleep -Seconds 2

# Start Frontend Server
Write-Host "Starting FRONTEND server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '=== FRONTEND SERVER ===' -ForegroundColor Cyan; Write-Host 'Port: 3000' -ForegroundColor Green; Write-Host ''; npm run dev"

Write-Host ""
Write-Host "✓ Both servers are starting in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window (servers will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
