import { prisma } from '@/config/prisma.js';
import type { INodeContextRepository } from '../../domain/interface/nodeContext.interface.js';
import type {
  NodeContext,
  NodeContextProvider,
} from '@/node/domain/entity/nodeContext.entity.js';

export class NodeContextRepository implements INodeContextRepository {
  async update(
    id: string,
    pathFromRoot: string[],
    constraints: string[],
    successSignals: string[],
    intentSummary?: string,
    rootNodeId?: string,
  ): Promise<NodeContext & NodeContextProvider> {
    return await prisma.nodeContext.update({
      where: { id },
      data: {
        ...(intentSummary ? { intentSummary } : {}),
        ...(rootNodeId ? { rootNodeId } : {}),
        pathFromRoot: { push: pathFromRoot },
        constraints: { push: constraints },
        successSignals: { push: successSignals },
      },
    });
  }

  async create(
    params: {
      rootNodeId: string;
      intentSummary: string;
      constraints: string[];
      successSignals: string[];
      pathFromRoot: string[];
    },
    id?: string,
  ): Promise<
    {
      rootNodeId: string;
      intentSummary: string;
      constraints: string[];
      successSignals: string[];
      pathFromRoot: string[];
    } & {
      nodeId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.nodeContext.create({
      data: { ...params, node: { connect: { id: id! } } },
    });
  }
  async getById(id: string): Promise<
    | ({
        rootNodeId: string;
        intentSummary: string;
        constraints: string[];
        successSignals: string[];
        pathFromRoot: string[];
      } & {
        nodeId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    return await prisma.nodeContext.findUnique({ where: { id } });
  }
  async getAll(id: string): Promise<
    ({
      rootNodeId: string;
      intentSummary: string;
      constraints: string[];
      successSignals: string[];
      pathFromRoot: string[];
    } & {
      nodeId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    throw new Error(
      'Method not implemented. Cannot get all node contexts by id ' + id,
    );
  }
}
