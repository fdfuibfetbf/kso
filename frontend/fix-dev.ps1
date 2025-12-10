# Fix Next.js Dev Server - Clear Cache and Restart
Write-Host "Stopping all Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

Write-Host "Clearing Next.js build cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next.tmp -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

Write-Host "Starting Next.js dev server on port 3000..." -ForegroundColor Green
$env:PORT = "3000"
npm run dev:next

