import { projectEntity, projectEntityWithoutId } from './project.entity.js';
import * as z from 'zod';

export const userEntity = z.object({
  id: z.string().trim().nonempty(),
  projects: z.array(projectEntity).nullish(),
  createdAt: z.iso.datetime().nullish(),
});

export const userEntityForCreatingNewProject = z.object({
  id: z.string().trim().nonempty(),
  project: projectEntityWithoutId.nonoptional(),
});
