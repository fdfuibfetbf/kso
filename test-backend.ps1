# Test Backend Server Connection
Write-Host "Testing Backend Server..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend server is running and responding!" -ForegroundColor Green
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Cyan
    Write-Host "  Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Backend server is not responding" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host "`nPlease start the backend server:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Cyan
}

