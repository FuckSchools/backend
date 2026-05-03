import z from 'zod';

export const nodeContextSchema = z.object( {
  nodeId: z.uuidv4(),
  rootNodeId: z.uuidv4(),
  intentSummary: z.string(),
  constraints: z.string().array(),
  successSignals: z.string().array(),
  pathFromRoot: z.string().array(),
});