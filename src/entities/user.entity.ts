import z from 'zod';
import { projectEntity } from './project.entity.js';

export const userEntity = z.object({
  internal: z.object({
    id: z.string().nonempty(),
    createdAt: z.date(),
  }),
  external: z.object({
    projects: z.array(projectEntity.shape.internal),
  }),
});
