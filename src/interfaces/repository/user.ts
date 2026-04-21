import { userEntity } from '@/entities/user.js';
import type { z } from 'zod';

export interface IUserRepository {
  register(
    userId: z.infer<typeof userEntity.shape.id>,
  ): Promise<z.infer<typeof userEntity.shape.id>>;
}
