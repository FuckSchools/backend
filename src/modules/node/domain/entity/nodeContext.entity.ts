import { Entity } from '@/shared/domain/entity/entity.js';
import { nodeContextSchema } from '../schema/nodeContext.schema.js';
import * as z from 'zod';

export class NodeContextEntity extends Entity<typeof nodeContextSchema> {
  constructor(data: z.infer<typeof nodeContextSchema>, id?: string) {
    super(data, nodeContextSchema, id);
  }
}
