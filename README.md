# Inventory Management System

A modern inventory management system built with Next.js frontend and Node.js backend, replacing the legacy PARTS ENTRY system with a professional, user-friendly interface.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Part Management**: Complete CRUD operations for inventory parts
- **Model Association**: Link model numbers and quantities to parts (P1/P2 tabs)
- **Search & Filter**: Quick search and pagination for parts list
- **Modern UI**: Clean, responsive interface built with shadcn/ui components
- **Real-time Updates**: Instant updates across all panels

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Zustand for state management
- Axios for API calls

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js 18+ and npm
- Git

**Note:** This project uses SQLite, so no database server installation is required!

## Setup Instructions

### 1. Clone and Navigate

```bash
cd "CTC-ERP system"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

The `.env` file is already configured for SQLite. If you need to recreate it:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
```

Initialize the database (already done, but if needed):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

**Note:** SQLite database file (`dev.db`) will be created automatically in the `backend` folder.

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Access the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account or login
3. Start managing your inventory!

## Project Structure

```
CTC-ERP-system/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth middleware
│   │   └── utils/           # Utilities
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/          # Auth pages
│   │   └── dashboard/       # Main inventory panel
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── inventory/       # Inventory components
│   │   └── layout/          # Layout components
│   └── lib/                 # Utilities, API client
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Parts
- `GET /api/parts` - List all parts (with pagination and search)
- `GET /api/parts/:id` - Get single part with models
- `GET /api/parts/partno/:partNo` - Get part by part number
- `POST /api/parts` - Create new part
- `PUT /api/parts/:id` - Update part
- `DELETE /api/parts/:id` - Delete part
- `GET /api/parts/search/:query` - Search parts

### Models
- `GET /api/models/part/:partId` - Get models for a part
- `POST /api/models/part/:partId` - Add model to part
- `PUT /api/models/:id` - Update model
- `DELETE /api/models/:id` - Delete model

All endpoints except `/api/auth/register` and `/api/auth/login` require authentication.

## Database Schema

- **User**: Authentication and user management
- **Part**: Main inventory part information
- **PartModel**: Model numbers and quantities associated with parts
- **Stock**: Stock levels for parts

## Development

### Backend
```bash
cd backend
npm run dev      # Development mode with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend
```bash
cd frontend
npm run dev      # Development mode
npm run build    # Build for production
npm start        # Run production build
```

## Notes

- Make sure PostgreSQL is running before starting the backend
- Update the `DATABASE_URL` in backend `.env` to match your PostgreSQL setup
- The JWT_SECRET should be a strong, random string in production
- All API calls from the frontend automatically include the authentication token

## License

ISC

