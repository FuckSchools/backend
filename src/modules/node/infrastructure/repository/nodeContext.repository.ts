import { prisma } from '@/config/prisma.js';
import { NodeContextEntity } from '@/node/domain/entity/nodeContext.entity.js';
import type { INodeContext } from '@/node/domain/interface/nodeContext.interface.js';

export class NodeContextRepository implements INodeContext {
  async save(data: NodeContextEntity): Promise<void> {
    await prisma.nodeContext.upsert({
      where: { id: data.id },
      update: { ...data.data },
      create: { ...data.data, id: data.id },
    });
  }
  async getById(id: string): Promise<NodeContextEntity | null> {
    const nodeContext = await prisma.nodeContext.findUnique({ where: { id } });
    if (!nodeContext) {
      return nodeContext;
    }
    return new NodeContextEntity(nodeContext, nodeContext.id);
  }
}
