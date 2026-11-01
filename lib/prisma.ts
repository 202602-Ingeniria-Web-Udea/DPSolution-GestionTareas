import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

// Las migraciones crean las tablas en el esquema "public" (el default de
// Postgres/Supabase cuando no se configura `multiSchema`), así que el
// adapter debe apuntar ahí también.
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
