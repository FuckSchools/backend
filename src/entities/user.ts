import { projectEntity } from './project.js';
import * as z from 'zod';

const authInfo = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email().optional(),
});

export const userEntity = z.object({
  id: z.string().nonempty(),
  authInfo: authInfo.optional(),
  projects: z.array(projectEntity).optional().default([]),
});
