import Fastify from 'fastify';
import { env } from './lib/env.js';
import corsPlugin from './plugins/cors.js';
import databasePlugin from './plugins/database.js';
import errorHandlerPlugin from './plugins/error-handler.js';
import authPlugin from './plugins/auth.js';
import { healthRoutes } from './routes/health.js';
import { authSignupRoute } from './routes/auth/signup.js';

function buildServer() {
  const fastify = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
    },
  });

  // Plugin registration order: cors → database → error-handler → auth → routes
  fastify.register(corsPlugin);
  fastify.register(databasePlugin);
  fastify.register(errorHandlerPlugin);
  fastify.register(authPlugin);
  fastify.register(healthRoutes, { prefix: '/api' });
  fastify.register(authSignupRoute, { prefix: '/api' });

  return fastify;
}

async function start() {
  const server = buildServer();

  const shutdown = async (signal: string) => {
    server.log.info(`Received ${signal}, shutting down gracefully...`);
    await server.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    await server.listen({ port: env.PORT, host: env.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
