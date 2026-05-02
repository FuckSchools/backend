import { providerEntity } from '@/shared/domain/entity/base.entity.js';
import z from 'zod';

export const projectEntity = z.object({
  title: z.string().nonempty(),
});

export const projectProviderEntity = z
  .object({
    userId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export const projectFullEntity = projectEntity.extend(
  projectProviderEntity.shape,
);

export type ProjectFull = z.infer<typeof projectFullEntity>;

export type Project = z.infer<typeof projectEntity>;
export type ProjectProvider = z.infer<typeof projectProviderEntity>;
