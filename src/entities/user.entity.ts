import { projectEntity } from './project.entity.js';
import * as z from 'zod';

export const userEntity = z.object({
  id: z.string().trim().nonempty(),
  projects: z.array(projectEntity).optional().default([]),
});
