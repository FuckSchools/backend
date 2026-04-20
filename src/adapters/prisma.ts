import { PrismaClient } from 'prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL_LOCAL']!,
});

export const prisma = new PrismaClient({ adapter });
