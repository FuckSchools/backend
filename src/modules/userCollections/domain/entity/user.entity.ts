import { providerEntity } from '@/shared/domain/entity/base.entity.js';
import z from 'zod';

export const userEntity = z.object({
  clerkId: z.string().nonempty(),
});

export const userProviderEntity = z.object({}).extend(providerEntity.shape);

export const userFullEntity = userEntity.extend(userProviderEntity.shape);

export type User = z.infer<typeof userEntity>;
export type UserProvider = z.infer<typeof userProviderEntity>;
export type UserFull = z.infer<typeof userFullEntity>;
