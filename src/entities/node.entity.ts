import { z } from 'zod';
export const statusEnum = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);

const stateOfCompletionEntity = z.object({
  content: z.string(),
  status: statusEnum,
});

export const nodeEntity = z.object({
  id: z.string().nonempty(),
  topic: z.string().optional(),
  content: z.string(),
  prerequisites: z.array(z.string()).optional().default([]),
  statesOfCompletion: z.array(stateOfCompletionEntity).optional().default([]),
  parentId: z.string().optional().nullable(),
  childIds: z.array(z.string()).optional().default([]),
});
