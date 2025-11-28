# Backend Startup Script
Write-Host "Starting Backend Server..." -ForegroundColor Green

# Refresh PATH and set execution policy
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Navigate to backend directory
Set-Location backend

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please create a .env file with the following variables:" -ForegroundColor Yellow
    Write-Host "DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db?schema=public" -ForegroundColor Cyan
    Write-Host "JWT_SECRET=your-super-secret-jwt-key" -ForegroundColor Cyan
    Write-Host "JWT_EXPIRES_IN=7d" -ForegroundColor Cyan
    Write-Host "PORT=5000" -ForegroundColor Cyan
    Write-Host "NODE_ENV=development" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue anyway (you'll need to set up .env later)..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Generate Prisma Client
Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# Start the server
Write-Host "Starting backend server on http://localhost:5000..." -ForegroundColor Green
npm run dev

