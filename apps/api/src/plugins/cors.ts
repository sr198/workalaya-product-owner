import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { env } from '../lib/env.js';

async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });
}

export default fp(corsPlugin, { name: 'cors' });
