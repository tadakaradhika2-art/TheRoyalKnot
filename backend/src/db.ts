import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Create Prisma Client
export const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully via Prisma ORM');
    return true;
  } catch (error: any) {
    console.warn('⚠️  PostgreSQL connection failed or service not running. Using resilient in-memory database store for demonstration.', error.message);
    return false;
  }
}

