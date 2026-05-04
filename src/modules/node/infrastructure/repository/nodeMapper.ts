import {
  nodeStatusEnum,
  nodeTypeEnum,
} from '@/node/domain/schema/node.schema.js';
import z from 'zod';

export const nodeSchemaFromInfrastructure = z.object({
  id: z.uuidv4(),
  status: nodeStatusEnum,
  type: nodeTypeEnum,
  goal: z.string(),
  blocker: z.string().nullable(),
  projectId: z.uuidv4().nullable(),
  depth: z.number().gte(0),
  parentId: z.uuidv4().nullable(),
  createdAt: z.date(),
});

export type NodeFromInfrastructure = z.infer<
  typeof nodeSchemaFromInfrastructure
>;

export const rootNodeMapper = (node: NodeFromInfrastructure) => {
  return {
    id: node.id,
    status: node.status,
    type: node.type,
    goal: node.goal,
    projectId: node.projectId!,
    depth: node.depth,
    createdAt: node.createdAt,
  };
};

export const nodeMapper = (node: NodeFromInfrastructure) => {
  return {
    id: node.id,
    status: node.status,
    type: node.type,
    goal: node.goal,
    blocker: node.blocker!,
    parentId: node.parentId!,
    depth: node.depth,
    createdAt: node.createdAt,
  };
};
