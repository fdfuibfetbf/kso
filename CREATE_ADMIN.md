# Create Admin User

## Option 1: Use the Registration Page (Easiest)

1. Open http://localhost:3000 in your browser
2. Click on "Register" or go to http://localhost:3000/register
3. Fill in the registration form:
   - Name: Your name
   - Email: Your email
   - Password: Your password (minimum 6 characters)
4. Click "Register"
5. You'll be automatically logged in!

## Option 2: Create Default Admin via Script

Run this command to create a default admin user:

```powershell
# Make sure PATH is refreshed
.\refresh-path.ps1

# Navigate to backend
cd backend

# Create admin user
npm run create-admin
```

**Default Admin Credentials:**
- Email: `admin@inventory.com`
- Password: `admin123`

⚠️ **Important:** Change the password after first login for security!

## Troubleshooting

### "Database connection error"
- Make sure PostgreSQL is running
- Check your `backend/.env` file has correct DATABASE_URL
- Run migrations first: `npx prisma migrate dev --name init`

### "User already exists"
- The admin user is already created
- Use the credentials above to login
- Or register a new user through the registration page

