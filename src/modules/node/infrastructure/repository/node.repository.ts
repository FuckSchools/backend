import { prisma } from '@/config/prisma.js';
import type {
  INodeRepository,
  IRootNodeRepository,
} from '../../domain/interface/node.interface.js';

export class RootNodeRepository implements IRootNodeRepository {
  async update(
    id: string,
    params: Partial<{
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      depth: number;
    }>,
  ): Promise<
    {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      depth: number;
    } & {
      projectId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    const rootNode = await prisma.node.update({ where: { id }, data: params });
    return { ...rootNode, projectId: rootNode.projectId! };
  }
  async create(
    params: {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      depth: number;
    },
    id?: string,
  ): Promise<
    {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      depth: number;
    } & {
      projectId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    const rootNode = await prisma.node.create({
      data: { ...params, project: { connect: { id: id! } } },
    });
    return { ...rootNode, projectId: id! };
  }
  async getById(id: string): Promise<
    | ({
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
        type: 'BUILDING' | 'CONCEPT';
        goal: string;
        depth: number;
      } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    const rootNode = await prisma.node.findUnique({ where: { id } });
    return rootNode ?
        { ...rootNode, projectId: rootNode.projectId! }
      : rootNode;
  }
  async getAll(id: string): Promise<
    ({
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      depth: number;
    } & {
      projectId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    throw new Error(
      'Method not implemented. Cannot get all root nodes for ' + id,
    );
  }
}

export class NodeRepository implements INodeRepository {
  async update(
    id: string,
    params: Partial<{
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string;
      depth: number;
    }>,
  ): Promise<
    {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string;
      depth: number;
    } & {
      parentId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    const node = await prisma.node.update({ where: { id }, data: params });
    return { ...node, parentId: node.parentId!, blocker: node.blocker! };
  }
  async create(
    params: {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string;
      depth: number;
    },
    id?: string,
  ): Promise<
    {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string;
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
    return { ...node, parentId: id!, blocker: node.blocker! };
  }
  async getById(id: string): Promise<
    | ({
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
        type: 'BUILDING' | 'CONCEPT';
        goal: string;
        blocker: string;
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
      console.error(
        `Node with id ${id} is a root node, but was fetched using NodeRepository. Consider using RootNodeRepository instead.`,
      );
      return {
        ...node,
        parentId: node.projectId!,
        blocker: node.blocker || '',
      };
    }
    return { ...node, parentId: node.parentId!, blocker: node.blocker! };
  }
  async getAll(id: string): Promise<
    ({
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string;
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
