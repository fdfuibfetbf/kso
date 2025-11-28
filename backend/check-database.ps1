# Database Connection Check Script
Write-Host "Checking Database Configuration..." -ForegroundColor Yellow

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "`n✗ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "`nPlease create a .env file with:" -ForegroundColor Yellow
    Write-Host 'DATABASE_URL="postgresql://username:password@localhost:5432/inventory_db?schema=public"' -ForegroundColor Cyan
    Write-Host 'JWT_SECRET="your-secret-key"' -ForegroundColor Cyan
    Write-Host 'JWT_EXPIRES_IN="7d"' -ForegroundColor Cyan
    Write-Host 'PORT=5000' -ForegroundColor Cyan
    Write-Host 'NODE_ENV=development' -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ .env file found" -ForegroundColor Green

# Load .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# Check DATABASE_URL
if (-not $env:DATABASE_URL) {
    Write-Host "`n✗ ERROR: DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ DATABASE_URL found" -ForegroundColor Green

# Try to connect
Write-Host "`nAttempting to connect to database..." -ForegroundColor Yellow
try {
    npx prisma db pull --preview-feature 2>&1 | Out-Null
    Write-Host "✓ Database connection successful!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Run: npx prisma migrate dev --name init" -ForegroundColor Cyan
    Write-Host "2. Start the server: npm run dev" -ForegroundColor Cyan
} catch {
    Write-Host "`n✗ Database connection failed!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "- PostgreSQL is running" -ForegroundColor Cyan
    Write-Host "- DATABASE_URL is correct" -ForegroundColor Cyan
    Write-Host "- Database exists" -ForegroundColor Cyan
    exit 1
}

