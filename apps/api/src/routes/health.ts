import type { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request, _reply) => {
    return { status: 'ok' };
  });
}
