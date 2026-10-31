import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: env.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.isDevelopment) {
  global.prisma = prisma;
}
