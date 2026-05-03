import { Entity } from '@/shared/domain/entity/entity.js';
import { rootNodeSchema, nodeSchema } from '../schema/node.schema.js';
import type z from 'zod';

export class RootNodeEntity extends Entity<typeof rootNodeSchema> {
  constructor(data: z.infer<typeof rootNodeSchema>, id?: string) {
    super(data, rootNodeSchema, id);
  }
}

export class NodeEntity extends Entity<typeof nodeSchema> {
  constructor(data: z.infer<typeof nodeSchema>, id?: string) {
    super(data, nodeSchema, id);
  }
}
