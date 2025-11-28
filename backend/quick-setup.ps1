# Quick Database Setup Script
Write-Host "=== PostgreSQL Quick Setup ===" -ForegroundColor Green

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

Write-Host "`nStep 1: Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    $dbPassword = Read-Host "Enter your PostgreSQL password (for user 'postgres')"
    
    @"
DATABASE_URL="postgresql://postgres:$dbPassword@localhost:5432/inventory_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    Write-Host "`nMake sure DATABASE_URL has your correct PostgreSQL password!" -ForegroundColor Yellow
}

Write-Host "`nStep 2: Checking PostgreSQL service..." -ForegroundColor Yellow
$pgServices = Get-Service | Where-Object { $_.Name -like "postgresql*" }
if ($pgServices) {
    $pgService = $pgServices[0]
    if ($pgService.Status -eq 'Running') {
        Write-Host "✓ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "Starting PostgreSQL service..." -ForegroundColor Yellow
        try {
            Start-Service -Name $pgService.Name
            Start-Sleep -Seconds 3
            Write-Host "✓ PostgreSQL service started" -ForegroundColor Green
        } catch {
            Write-Host "✗ Could not start PostgreSQL service" -ForegroundColor Red
            Write-Host "Please start it manually from Services (services.msc)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "✗ PostgreSQL service not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL first. See POSTGRESQL_SETUP.md" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nStep 3: Testing database connection..." -ForegroundColor Yellow
# Load .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim().Trim('"')
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

try {
    # Try to connect
    npx prisma generate
    Write-Host "✓ Prisma Client generated" -ForegroundColor Green
    
    Write-Host "`nStep 4: Creating database (if needed)..." -ForegroundColor Yellow
    # Try to create database using psql if available
    $psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"
    if (-not (Test-Path $psqlPath)) {
        $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
    }
    if (-not (Test-Path $psqlPath)) {
        $psqlPath = "C:\Program Files\PostgreSQL\14\bin\psql.exe"
    }
    
    if (Test-Path $psqlPath) {
        Write-Host "Note: If database doesn't exist, create it using pgAdmin or:" -ForegroundColor Yellow
        Write-Host "  $psqlPath -U postgres -c `"CREATE DATABASE inventory_db;`"" -ForegroundColor Cyan
    }
    
    Write-Host "`nStep 5: Running migrations..." -ForegroundColor Yellow
    npx prisma migrate dev --name init
    
    Write-Host "`n✓✓✓ Setup Complete! ✓✓✓" -ForegroundColor Green
    Write-Host "`nYou can now start the server:" -ForegroundColor Yellow
    Write-Host "  npm run dev" -ForegroundColor Cyan
    
} catch {
    Write-Host "`n✗ Setup failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nPlease check:" -ForegroundColor Yellow
    Write-Host "1. PostgreSQL is installed and running" -ForegroundColor Cyan
    Write-Host "2. Database 'inventory_db' exists" -ForegroundColor Cyan
    Write-Host "3. DATABASE_URL in .env has correct password" -ForegroundColor Cyan
    Write-Host "`nSee POSTGRESQL_SETUP.md for help" -ForegroundColor Yellow
}

