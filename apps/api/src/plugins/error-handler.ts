import { ERROR_CODES } from '@workalaya/shared';
import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { AppError } from '../lib/errors.js';

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError | AppError, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: { code: error.code, message: error.message },
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error.message,
        },
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Internal server error',
      },
    });
  });

  fastify.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      error: { code: ERROR_CODES.NOT_FOUND, message: 'Route not found' },
    });
  });
}

export default fp(errorHandlerPlugin, { name: 'error-handler' });
