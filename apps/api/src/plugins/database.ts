import { prisma } from '@workalaya/db';
import type { PrismaClient } from '@workalaya/db';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

async function databasePlugin(fastify: FastifyInstance) {
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
}

export default fp(databasePlugin, { name: 'database' });
