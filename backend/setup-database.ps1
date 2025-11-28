# Database Setup Script
Write-Host "Setting up database..." -ForegroundColor Green

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "`n✗ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "`nCreating .env file template..." -ForegroundColor Yellow
    
    @"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8
    
    Write-Host "✓ .env file created!" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Edit .env file and update DATABASE_URL with your PostgreSQL credentials!" -ForegroundColor Yellow
    Write-Host "Press any key after updating .env file..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

Write-Host "`nGenerating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`nRunning database migrations..." -ForegroundColor Yellow
try {
    npx prisma migrate dev --name init
    Write-Host "`n✓ Database setup complete!" -ForegroundColor Green
} catch {
    Write-Host "`n✗ Migration failed. Please check:" -ForegroundColor Red
    Write-Host "- PostgreSQL is running" -ForegroundColor Cyan
    Write-Host "- DATABASE_URL in .env is correct" -ForegroundColor Cyan
    Write-Host "- Database exists (or create it first)" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n✓ Setup complete! You can now start the server with: npm run dev" -ForegroundColor Green

