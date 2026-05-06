import z from 'zod';

export const rootNodeStateSchema = z.object({
  goal: z.string(),
  childNodeIds: z.uuidv4().array(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED']),
  type: z.enum(['BUILDING', 'CONCEPT']),
  depth: z.number(),
});

export const nodeContextStateSchema = z.object({
  rootNodeId: z.uuidv4(),
  intentSummary: z.string(),
  constraints: z.string().array(),
  successSignals: z.string().array(),
  pathFromRoot: z.string().array(),
});

export const nodeStateSchema = rootNodeStateSchema.extend({
  parentNodeId: z.uuidv4(),
  blocker: z.string(),
  nodeContextState: nodeContextStateSchema.optional(),
});

export const nodeTransitionSchema = z.object({
  reason: z.string(),
  triggeredBy: z.string(),
  nodeId: z.uuidv4(),
});
