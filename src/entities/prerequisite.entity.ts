import z from 'zod';
import { statusEnum } from './soc.entity.js';

export const prerequisiteEntity = z.object({
  internal: z.object({
    id: z.uuidv4().nonempty(),
    content: z.string().nonempty(),
    status: statusEnum,
    updatedAt: z.date(),
    createdAt: z.date(),
  }),
  external: z.object({
    nodeId: z.uuidv4(),
  }),
});

export const prerequisiteCreationEntity = prerequisiteEntity.shape.internal
  .pick({
    content: true,
    status: true,
  })
  .extend({ nodeId: prerequisiteEntity.shape.external.shape.nodeId });
