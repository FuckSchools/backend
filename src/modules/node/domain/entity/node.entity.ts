import { providerEntity } from '@/shared/domain/entity/entity.js';
import z from 'zod';

export const nodeStatusEnum = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
]);

export const nodeTypeEnum = z.enum(['BUILDING', 'CONCEPT']);
export const nodeEntity = z.object({
  status: nodeStatusEnum,
  type: nodeTypeEnum,
  goal: z.string(),
  blocker: z.string(),
  depth: z.number(),
});

export const rootNodeEntity = z.object({
  status: nodeStatusEnum,
  type: nodeTypeEnum,
  goal: z.string(),
  depth: z.number().default(0),
});

export const nodeProviderEntity = z
  .object({
    parentId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export const rootNodeProviderEntity = z
  .object({
    projectId: z.uuidv4(),
  })
  .extend(providerEntity.shape);

export type Node = z.infer<typeof nodeEntity>;
export type RootNode = z.infer<typeof rootNodeEntity>;
export type NodeProvider = z.infer<typeof nodeProviderEntity>;
export type RootNodeProvider = z.infer<typeof rootNodeProviderEntity>;

export const nodeFullEntity = nodeEntity.extend(nodeProviderEntity.shape);
export const rootNodeFullEntity = rootNodeEntity.extend(
  rootNodeProviderEntity.shape,
);

export type NodeFull = z.infer<typeof nodeFullEntity>;
export type RootNodeFull = z.infer<typeof rootNodeFullEntity>;
