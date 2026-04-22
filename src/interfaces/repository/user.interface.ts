import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface IUserRepository {
  register(
    userId: z.infer<typeof userEntity.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.id>>;
  findById(
    userId: z.infer<typeof userEntity.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.id> | undefined>;
}
