import { PrismaClient } from '@prisma/client';
import path from 'path';
import { existsSync } from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Function to normalize and fix DATABASE_URL
function getDatabaseUrl(): string {
  let databaseUrl = process.env.DATABASE_URL;

  // In Vercel/production, DATABASE_URL should be set as environment variable
  // For SQLite, we need a cloud database or file storage solution
  if (!databaseUrl) {
    // In production/Vercel, throw error if DATABASE_URL is not set
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL environment variable is required in production. Please set it in Vercel environment variables.');
    }
    
    // In development, try to construct default path
    const defaultPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
    if (existsSync(defaultPath)) {
      databaseUrl = `file:${defaultPath.replace(/\\/g, '/')}`;
    } else {
      throw new Error('DATABASE_URL is not set and default database file does not exist');
    }
  } else {
    // Remove quotes if present
    databaseUrl = databaseUrl.replace(/^["']|["']$/g, '').trim();
    
    // In Vercel/production, if it's a file: URL, it won't work
    if ((process.env.VERCEL || process.env.NODE_ENV === 'production') && databaseUrl.startsWith('file:')) {
      console.error('[Prisma] ERROR: SQLite file databases are not supported on Vercel serverless functions.');
      console.error('[Prisma] Please use a cloud database (PostgreSQL, MySQL, or Turso) for production.');
      throw new Error('SQLite file databases are not supported in production. Please configure a cloud database.');
    }
    
    // Ensure it starts with file: protocol (only for local development)
    if (!databaseUrl.startsWith('file:') && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('mysql://') && !databaseUrl.startsWith('postgres://')) {
      // If it's a relative path, convert to absolute (development only)
      if (databaseUrl.startsWith('./')) {
        const dbPath = databaseUrl.replace('./', '');
        const absolutePath = path.resolve(process.cwd(), dbPath).replace(/\\/g, '/');
        databaseUrl = `file:${absolutePath}`;
      } else {
        // Assume it's a path and add file: prefix (development only)
        const absolutePath = path.resolve(process.cwd(), databaseUrl).replace(/\\/g, '/');
        databaseUrl = `file:${absolutePath}`;
      }
    } else if (databaseUrl.startsWith('file:./')) {
      // Convert relative file: path to absolute (development only)
      const dbPath = databaseUrl.replace('file:./', '');
      const absolutePath = path.resolve(process.cwd(), dbPath).replace(/\\/g, '/');
      databaseUrl = `file:${absolutePath}`;
    }
  }
  
  // Verify the database file exists (only for file: URLs in development)
  if (databaseUrl.startsWith('file:') && !process.env.VERCEL && process.env.NODE_ENV !== 'production') {
    const dbPath = databaseUrl.replace(/^file:/, '');
    if (!existsSync(dbPath)) {
      console.warn(`[Prisma] Warning: Database file does not exist at: ${dbPath}`);
    }
  }
  
  // Update environment variable
  process.env.DATABASE_URL = databaseUrl;
  
  return databaseUrl;
}

// Get the normalized database URL
const databaseUrl = getDatabaseUrl();

// Log the final DATABASE_URL (masked for security)
if (process.env.NODE_ENV === 'development') {
  const maskedUrl = databaseUrl.replace(/file:.*\//, 'file:.../');
  console.log('[Prisma] DATABASE_URL:', maskedUrl);
}

// Create Prisma Client with the normalized URL
// In serverless environments, we need to handle connection more carefully
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Handle connection errors gracefully in serverless
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // In production, don't connect eagerly - let each request handle connection
  prisma.$connect().catch((error) => {
    console.error('[Prisma] Connection error:', error);
    // Don't throw - let individual requests handle errors
  });
}

