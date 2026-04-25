import { z } from 'zod';
import { stateOfCompletionEntity } from './soc.entity.js';
import { prerequisiteEntity } from './prerequisite.entity.js';
export const nodeInternalEntity = z.object({
  id: z.uuidv4(),
  content: z.string().nonempty(),
  createdAt: z.date(),
});

export const nodeExternalEntity = z.object({
  prerequisites: z.array(prerequisiteEntity.shape.internal),
  statesOfCompletion: z.array(stateOfCompletionEntity.shape.internal),
  parentId: z.uuidv4(),
  childNodes: z.array(nodeInternalEntity),
});

export const nodeCreationEntity = nodeInternalEntity
  .pick({
    content: true,
  })
  .extend({
    parentId: z.uuidv4(),
  });

export const nodeEntity = z.object({
  internal: nodeInternalEntity,
  external: nodeExternalEntity,
});
