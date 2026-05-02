import { Entity } from '@/shared/domain/entity/entity.js';
import z from 'zod';
import { userSchema } from '../schema/user.schema.js';

export class UserEntity extends Entity<typeof userSchema> {
  constructor(data: z.infer<typeof userSchema>, id?: string) {
    super(data, userSchema, id);
  }
}
