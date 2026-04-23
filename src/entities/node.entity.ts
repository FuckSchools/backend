import { z } from 'zod';
export const statusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);

const stateOfCompletionEntity = z.object( {
  id: z.uuidv4().nonempty(),
  content: z.string().nonempty(),
  status: statusEnum,
  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
});

const partialNodeEntity = z.object({
  id: z.uuidv4().nonempty(),
  topic: z.string().nonempty(),
  content: z.string().nonempty(),
  prerequisites: z.array(z.string()).nullish(),
  statesOfCompletion: z.array(stateOfCompletionEntity).nullish(),
  createdAt: z.iso.datetime().nullish(),
});
export const nodeEntity = z
  .object({
    parentNode: partialNodeEntity.nullish(),
    childNodes: z.array(partialNodeEntity).nullish(),
    createdAt: z.iso.datetime().nullish(),
  })
  .extend(partialNodeEntity);
