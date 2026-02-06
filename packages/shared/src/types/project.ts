import type { z } from 'zod';
import type { projectCreateSchema, projectUpdateSchema } from '../schemas/project.js';

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
