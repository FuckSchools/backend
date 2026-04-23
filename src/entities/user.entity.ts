import {
  projectCreationInputEntity,
  projectCreationOutputEntity,
  projectEntity,
} from './project.entity.js';
import * as z from 'zod';

export const userEntity = z.object({
  id: z.string().trim().nonempty(),
  projects: z.array(projectEntity).nullish(),
  createdAt: z.iso.datetime().nullish(),
});

export const userEntityWithProjectCreationInputEntity = z.object({
  id: z.string().trim().nonempty(),
  project: projectCreationInputEntity.nonoptional(),
} );

export const userEntityWithProjectCreationOutputEntity = z.object({
  id: z.string().trim().nonempty(),
  project: projectCreationOutputEntity.nonoptional(),
} );

export const userCreationInputEntity = z.object({
  id: z.string().trim().nonempty(),
});

export const userCreationOutputEntity = userCreationInputEntity.extend(
  z.object({
    createdAt: z.iso.datetime(),
  }),
);
