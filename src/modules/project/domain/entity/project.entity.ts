import { providerEntity } from '@/modules/shared/domain/entity/base.entity.js';
import z from 'zod';

export const projectEntity = z.object({
  title: z.string().nonempty(),
});

export const projectProviderEntity = z
  .object({
    userId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export type Project = z.infer<typeof projectEntity>;
export type ProjectProvider = z.infer<typeof projectProviderEntity>;
