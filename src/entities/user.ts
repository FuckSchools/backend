import { projectEntity } from './project.js';
import * as z from 'zod';

export const userEntity = z.object({
  id: z.string().nonempty(),
  projects: z.array(projectEntity).optional().default([]),
});
