import z from 'zod';

export const nodeStatusEnum = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
]);

export const nodeTypeEnum = z.enum(['BUILDING', 'CONCEPT']);
export const nodeSchema = z.object({
  status: nodeStatusEnum,
  type: nodeTypeEnum,
  goal: z.string(),
  blocker: z.string(),
  depth: z.number(),
  parentId: z.uuidv4(),
});

export const rootNodeSchema = z.object({
  status: nodeStatusEnum,
  type: nodeTypeEnum,
  goal: z.string(),
  depth: z.number().default(0),
  projectId: z.uuidv4(),
});
