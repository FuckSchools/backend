import { Entity } from '@/shared/domain/entity/entity.js';
import {
  nodeStateSchema,
  nodeTransitionSchema,
  rootNodeStateSchema,
} from '../schema/nodeState.schema.js';
import type z from 'zod';

export class RootNodeStateEntity extends Entity<typeof rootNodeStateSchema> {
  constructor(data: z.infer<typeof rootNodeStateSchema>, id?: string) {
    super(data, rootNodeStateSchema, id);
  }
}

export class NodeStateEntity extends Entity<typeof nodeStateSchema> {
  constructor(data: z.infer<typeof nodeStateSchema>, id?: string) {
    super(data, nodeStateSchema, id);
  }
}

export class NodeTransitionStateEntity extends Entity<
  typeof nodeTransitionSchema
> {
  constructor(data: z.infer<typeof nodeTransitionSchema>, id?: string) {
    super(data, nodeTransitionSchema, id);
  }
}
