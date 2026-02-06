import type { FastifyInstance } from 'fastify';
import { signUpSchema } from '@workalaya/shared';
import bcrypt from 'bcryptjs';
import { ConflictError } from '../../lib/errors.js';

export async function authSignupRoute(fastify: FastifyInstance) {
  fastify.post('/auth/signup', async (request, reply) => {
    const parsed = signUpSchema.safeParse(request.body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0];
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: firstError?.message ?? 'Invalid request payload',
        },
      });
    }

    const { email, password, name } = parsed.data;

    const existingUser = await fastify.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await fastify.prisma.user.create({
      data: { email, name, passwordHash },
    });

    return reply.status(201).send({
      data: { id: user.id, email: user.email, name: user.name },
    });
  });
}
