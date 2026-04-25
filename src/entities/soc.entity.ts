import * as z from '../../node_modules/zod/v4/classic/external.cjs';

export const statusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);
export const stateOfCompletionEntity = z.object({
  internal: z.object({
    id: z.uuidv4().nonempty(),
    content: z.string().nonempty(),
    status: statusEnum,
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  external: z.object({
    nodeId: z.uuidv4(),
  }),
});

export const socCreationEntity = stateOfCompletionEntity.shape.internal
  .pick({
    content: true,
    status: true,
  })
  .extend({ nodeId: stateOfCompletionEntity.shape.external.shape.nodeId });
