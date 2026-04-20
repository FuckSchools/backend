import { z } from 'zod';

export const nodeEntity = z.object({
  id: z.string().nonempty(),
  topic: z.string().optional(),
  prerequisites: z.array(z.string()).optional().default([]),
  statesOfCompletion: z
    .array(z.map(z.string(), z.boolean().default(false)))
    .optional()
    .default([]),
  parentId: z.string().optional().nullable(),
  childIds: z.array(z.string()).optional().default([]),
});
