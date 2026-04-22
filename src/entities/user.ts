import { projectEntity } from './project.js';
import * as z from 'zod';

export const userEntity = z.object({
  id: z.string().refine((value) => value.trim().length > 0),
  projects: z.array(projectEntity).optional().default([]),
});
