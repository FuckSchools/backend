import { providerEntity } from '@/shared/domain/entity/base.entity.js';
import z from 'zod';

export const nodeContextEntity = z.object({
  rootNodeId: z.string(),
  intentSummary: z.string(),
  constraints: z.string().array(),
  successSignals: z.string().array(),
  pathFromRoot: z.string().array(),
});

export const nodeContextProviderEntity = z
  .object({
    nodeId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export type NodeContext = z.infer<typeof nodeContextEntity>;
export type NodeContextProvider = z.infer<typeof nodeContextProviderEntity>;
