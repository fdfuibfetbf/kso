# Fix Database Path Script
Write-Host "Fixing SQLite database path..." -ForegroundColor Yellow

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Get absolute path to database
$dbPath = Join-Path $PSScriptRoot "prisma\dev.db"
$dbPath = $dbPath -replace '\\', '/'

# Check if database exists
if (-not (Test-Path $dbPath)) {
    Write-Host "Database not found. Creating it..." -ForegroundColor Yellow
    # Create directory if needed
    $dbDir = Split-Path $dbPath -Parent
    if (-not (Test-Path $dbDir)) {
        New-Item -ItemType Directory -Path $dbDir -Force | Out-Null
    }
    # Touch the file
    New-Item -ItemType File -Path $dbPath -Force | Out-Null
}

# Update .env with absolute path
$envContent = @"
DATABASE_URL="file:$dbPath"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host "✓ .env file updated" -ForegroundColor Green
Write-Host "  Database path: $dbPath" -ForegroundColor Cyan

# Test connection
Write-Host "`nTesting database connection..." -ForegroundColor Yellow
try {
    npx prisma db pull --preview-feature 2>&1 | Out-Null
    Write-Host "✓ Database connection successful!" -ForegroundColor Green
} catch {
    Write-Host "✗ Database connection failed" -ForegroundColor Red
    Write-Host "  Error: $_" -ForegroundColor Red
}

Write-Host "`nYou can now restart the backend server:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan

