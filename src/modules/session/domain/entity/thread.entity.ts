import { Entity } from '@/shared/domain/entity/entity.js';
import { threadSchema } from '../schema/thread.schema.js';
import type z from 'zod';

export class ThreadEntity extends Entity<typeof threadSchema> {
  constructor(data: z.infer<typeof threadSchema>, id?: string) {
    super(data, threadSchema, id);
  }
}
