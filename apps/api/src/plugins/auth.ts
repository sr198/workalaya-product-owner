import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { jwtVerify } from 'jose';
import { env } from '../lib/env.js';
import { UnauthorizedError } from '../lib/errors.js';

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

const PUBLIC_ROUTES = ['/api/health', '/api/auth/signup'];

async function authPlugin(fastify: FastifyInstance) {
  fastify.decorateRequest('userId', '');

  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    const urlPath = request.url.split('?')[0] ?? request.url;
    if (PUBLIC_ROUTES.includes(urlPath)) {
      return;
    }

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);
    try {
      const secret = new TextEncoder().encode(env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);

      if (!payload.userId || typeof payload.userId !== 'string') {
        throw new UnauthorizedError('Invalid token payload');
      }

      request.userId = payload.userId;
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new UnauthorizedError('Invalid or expired token');
    }
  });
}

export default fp(authPlugin, {
  name: 'auth',
  dependencies: ['database'],
});
