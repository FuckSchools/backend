import { z } from 'zod';
import { nodeEntity } from './node.js';

export const treeEntity = z.object({
  id: z.string().nonempty(),
  rootNode: nodeEntity,
});
