import type { z } from 'zod';
import type { signUpSchema, loginSchema } from '../schemas/user.js';

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
