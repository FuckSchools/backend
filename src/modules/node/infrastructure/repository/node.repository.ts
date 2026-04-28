import { prisma } from '@/config/prisma.js';
import type { INodeRepository } from '../../domain/interface/node.interface.js';
import type {
  RootNode,
  RootNodeProvider,
} from '../../domain/entity/node.entity.js';

export class NodeRepository implements INodeRepository {
  async createRootNode(
    params: RootNode,
    id: string,
  ): Promise<RootNode & RootNodeProvider> {
    const rootNode = await prisma.node.create({
      data: { ...params, project: { connect: { id } } },
    });
    return { ...rootNode, projectId: id };
  }
  async create(
    params: {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string | null;
      depth: number;
    },
    id?: string,
  ): Promise<
    {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string | null;
      depth: number;
    } & {
      parentId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    const node = await prisma.node.create({
      data: { ...params, parent: { connect: { id: id! } } },
    });
    return { ...node, parentId: id! };
  }
  async getById(id: string): Promise<
    | ({
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
        type: 'BUILDING' | 'CONCEPT';
        goal: string;
        blocker: string | null;
        depth: number;
      } & {
        parentId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    const node = await prisma.node.findUnique({ where: { id } });
    if (!node) {
      return node;
    }
    if (node.depth === 0) {
      return { ...node, parentId: node.projectId! };
    }
    return { ...node, parentId: node.parentId! };
  }
  async getAll(id: string): Promise<
    ({
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string | null;
      depth: number;
    } & {
      parentId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    throw new Error(`Method not implemented. Cannot get all nodes by id ${id}`);
  }
}
