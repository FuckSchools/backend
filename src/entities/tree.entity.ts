import { z } from 'zod';
import { nodeEntity } from './node.entity.js';

export const treeEntity = z.object({
  id: z.uuidv4().nonempty(),
  rootNode: nodeEntity.refine((node) => {
    return !node.parentNode;
  }, 'Tree must be linked to a root node without parentNode'),
});
