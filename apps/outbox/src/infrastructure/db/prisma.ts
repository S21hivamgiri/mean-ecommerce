import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

// 1. Create a native PostgreSQL connection pool
const pool = new Pool({ connectionString });

// 2. Wrap it with Prisma's driver adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient constructor
export const prisma = new PrismaClient({ adapter });
