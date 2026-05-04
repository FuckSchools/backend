import { prisma } from '@/config/prisma.js';
import { NodeContextEntity } from '@/node/domain/entity/nodeContext.entity.js';
import type { INodeContext } from '@/node/domain/interface/nodeContext.interface.js';
import { okAsync, errAsync, type ResultAsync } from 'neverthrow';

export class NodeContextRepository implements INodeContext {
  async getByNodeId(
    nodeId: string,
  ): Promise<ResultAsync<NodeContextEntity | null, string>> {
    try {
      const node = await prisma.node.findUnique({
        where: { id: nodeId },
        include: { context: true },
      });
      if (!node || !node.context) {
        return okAsync(null);
      }
      return okAsync(new NodeContextEntity(node.context, node.context.id));
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async save(data: NodeContextEntity): Promise<ResultAsync<void, string>> {
    try {
      await prisma.nodeContext.upsert({
        where: { id: data.id },
        update: { ...data.data },
        create: { ...data.data, id: data.id },
      });
      return okAsync(undefined as void);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getById(id: string): Promise<ResultAsync<NodeContextEntity | null, string>> {
    try {
      const nodeContext = await prisma.nodeContext.findUnique({ where: { id } });
      if (!nodeContext) {
        return okAsync(null);
      }
      return okAsync(new NodeContextEntity(nodeContext, nodeContext.id));
    } catch (error) {
      return errAsync(String(error));
    }
  }
}
