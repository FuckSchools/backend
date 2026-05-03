import { Entity } from '@/shared/domain/entity/entity.js';
import { messageSchema } from '../schema/message.schema.js';
import type z from 'zod';

export class MessageEntity extends Entity<typeof messageSchema> {
  constructor(data: z.infer<typeof messageSchema>, id?: string) {
    super(data, messageSchema, id);
  }
}
