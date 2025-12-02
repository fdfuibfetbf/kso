import { PrismaClient } from '@prisma/client';
import path from 'path';
import { existsSync } from 'fs';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Function to normalize and fix DATABASE_URL
function getDatabaseUrl(): string {
  let databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Try to construct default path
    const defaultPath = path.resolve(process.cwd(), 'prisma', 'dev.db');
    if (existsSync(defaultPath)) {
      databaseUrl = `file:${defaultPath.replace(/\\/g, '/')}`;
    } else {
      throw new Error('DATABASE_URL is not set and default database file does not exist');
    }
  } else {
    // Remove quotes if present
    databaseUrl = databaseUrl.replace(/^["']|["']$/g, '').trim();
    
    // Ensure it starts with file: protocol
    if (!databaseUrl.startsWith('file:')) {
      // If it's a relative path, convert to absolute
      if (databaseUrl.startsWith('./')) {
        const dbPath = databaseUrl.replace('./', '');
        const absolutePath = path.resolve(process.cwd(), dbPath).replace(/\\/g, '/');
        databaseUrl = `file:${absolutePath}`;
      } else {
        // Assume it's a path and add file: prefix
        const absolutePath = path.resolve(process.cwd(), databaseUrl).replace(/\\/g, '/');
        databaseUrl = `file:${absolutePath}`;
      }
    } else if (databaseUrl.startsWith('file:./')) {
      // Convert relative file: path to absolute
      const dbPath = databaseUrl.replace('file:./', '');
      const absolutePath = path.resolve(process.cwd(), dbPath).replace(/\\/g, '/');
      databaseUrl = `file:${absolutePath}`;
    }
  }
  
  // Verify the database file exists
  const dbPath = databaseUrl.replace(/^file:/, '');
  if (!existsSync(dbPath)) {
    console.warn(`[Prisma] Warning: Database file does not exist at: ${dbPath}`);
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
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

