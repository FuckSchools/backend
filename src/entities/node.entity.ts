import { z } from 'zod';
export const statusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);

const stateOfCompletionEntity = z.object({
  internal: z.object({
    id: z.uuidv4().nonempty(),
    content: z.string().nonempty(),
    status: statusEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});
export const nodeInternalEntity = z.object({
  id: z.uuidv4(),
  content: z.string().nonempty(),
  createdAt: z.date(),
});

export const nodeEntity = z.object({
  internal: nodeInternalEntity,
  external: z.object({
    prerequisites: z.array(z.string()),
    statesOfCompletion: z.array(stateOfCompletionEntity.shape.internal),
    parentNode: nodeInternalEntity.nullable(),
    childNodes: z.array(nodeInternalEntity),
  }),
});
