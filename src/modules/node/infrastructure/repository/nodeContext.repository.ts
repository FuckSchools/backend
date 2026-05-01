import { prisma } from '@/config/prisma.js';
import type { INodeContextRepository } from '../../domain/interface/nodeContext.interface.js';
import type {
  NodeContext,
  NodeContextFull,
} from '@/node/domain/entity/nodeContext.entity.js';

export class NodeContextRepository implements INodeContextRepository {
  async create(nodeId: string, params: NodeContext): Promise<NodeContextFull> {
    return await prisma.nodeContext.create({
      data: { ...params, node: { connect: { id: nodeId } } },
    });
  }
  async getByNodeId(nodeId: string): Promise<NodeContextFull | null> {
    return await prisma.nodeContext.findUnique({ where: { nodeId } });
  }
  async update(
    nodeContextId: string,
    params: NodeContext,
  ): Promise<NodeContextFull> {
    return await prisma.nodeContext.update({
      where: { id: nodeContextId },
      data: params,
    });
  }
}
