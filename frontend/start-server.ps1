# Start the development server
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Set environment
$env:NODE_ENV = "development"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Push database schema
Write-Host "Pushing database schema..." -ForegroundColor Yellow
npx prisma db push

# Start the server
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Green
Write-Host ""

npm run dev
