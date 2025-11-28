# Test PostgreSQL Connection Script
Write-Host "Testing PostgreSQL Connection..." -ForegroundColor Yellow

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "Please create backend/.env file first" -ForegroundColor Yellow
    exit 1
}

# Load .env variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

Write-Host "`nChecking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    if ($pgService.Status -eq 'Running') {
        Write-Host "✓ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL service is not running" -ForegroundColor Red
        Write-Host "Starting PostgreSQL service..." -ForegroundColor Yellow
        Start-Service -Name $pgService.Name
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "⚠ PostgreSQL service not found" -ForegroundColor Yellow
    Write-Host "Make sure PostgreSQL is installed" -ForegroundColor Yellow
}

Write-Host "`nTesting database connection..." -ForegroundColor Yellow
try {
    npx prisma db pull --preview-feature 2>&1 | Out-Null
    Write-Host "✓ Database connection successful!" -ForegroundColor Green
    Write-Host "`nYou can now run migrations:" -ForegroundColor Yellow
    Write-Host "npx prisma migrate dev --name init" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Database connection failed!" -ForegroundColor Red
    Write-Host "`nPlease check:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL is installed and running" -ForegroundColor Cyan
    Write-Host "2. DATABASE_URL in .env is correct" -ForegroundColor Cyan
    Write-Host "3. Database 'inventory_db' exists" -ForegroundColor Cyan
    Write-Host "4. Username and password are correct" -ForegroundColor Cyan
    Write-Host "`nSee POSTGRESQL_SETUP.md for detailed instructions" -ForegroundColor Yellow
}

