import 'dotenv/config';
import { PrismaClient } from 'prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString:
    process.env['NODE_ENV'] === 'test' ?
      process.env['DATABASE_URL_TEST']
    : process.env['DATABASE_URL'],
});

export const prisma = new PrismaClient({ adapter });
