import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fix database URL if it's a relative path
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && databaseUrl.startsWith('file:./')) {
  const dbPath = databaseUrl.replace('file:./', '');
  const absolutePath = path.resolve(process.cwd(), dbPath).replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${absolutePath}`;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

