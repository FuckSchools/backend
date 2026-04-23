import { z } from 'zod';
export const statusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);

const stateOfCompletionEntity = z.object({
  content: z.string().nonempty(),
  status: statusEnum,
  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
});

const partialNodeEntity = z.object({
  id: z.uuid().nonempty(),
  topic: z.string().nonempty(),
  content: z.string().nonempty(),
  prerequisites: z.array(z.string()).default([]),
  statesOfCompletion: z.array(stateOfCompletionEntity).default([]),
  createdAt: z.iso.datetime().nullish(),
});
export const nodeEntity = z
  .object({
    parentNode: partialNodeEntity.nullish(),
    childNodes: z.array(partialNodeEntity).nullish(),
    createdAt: z.iso.datetime().nullish(),
  })
  .extend(partialNodeEntity);
