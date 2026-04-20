import { z } from 'zod';
import { treeEntity } from './tree.js';

export const projectEntity = z.object({
  id: z.string().nonempty(),
  name: z.string().optional(),
  description: z.string().optional(),
  sandboxExId: z.string().optional(),
  tree: treeEntity.optional(),
  sessions: z.array(z.any()).optional(),
});
