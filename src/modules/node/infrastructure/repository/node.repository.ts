import { prisma } from '@/config/prisma.js';
import {
  NodeEntity,
  RootNodeEntity,
} from '@/node/domain/entity/node.entity.js';
import type {
  INodeRepository,
  IRootNodeRepository,
} from '@/node/domain/interface/node.interface.js';
import { nodeMapper, rootNodeMapper } from './nodeMapper.js';

export class RootNodeRepository implements IRootNodeRepository {
  async getByProjectId(projectId: string): Promise<RootNodeEntity | null> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { rootNode: true },
    });
    if (!project || !project.rootNode) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }
    return new RootNodeEntity(
      rootNodeMapper(project.rootNode),
      project.rootNode.id,
    );
  }
  async save(data: RootNodeEntity): Promise<void> {
    await prisma.project.update({
      where: { id: data.data.projectId, rootNode: {} },
      data: { ...data.data, id: data.id },
    });
  }
  async getById(id: string): Promise<RootNodeEntity | null> {
    const rootNode = await prisma.node.findUnique({ where: { id } });
    if (!rootNode) {
      return rootNode;
    }
    return new RootNodeEntity(rootNodeMapper(rootNode), rootNode.id);
  }
  async getChildNodes(nodeId: string): Promise<NodeEntity[]> {
    const parentNode = await prisma.node.findUnique({
      where: { id: nodeId },
      include: { childNodes: true },
    });
    if (!parentNode) {
      throw new Error(`Parent node with id ${nodeId} not found`);
    }
    if (parentNode.childNodes.length === 0) {
      return [];
    }
    return parentNode.childNodes.map(
      (childNode) => new NodeEntity(nodeMapper(childNode), childNode.id),
    );
  }
}

export class NodeRepository implements INodeRepository {
  async save(data: NodeEntity): Promise<void> {
    await prisma.node.update({
      where: { id: data.data.parentId },
      data: { childNodes: { create: { ...data.data, id: data.id } } },
    });
  }
  async getById(id: string): Promise<NodeEntity | null> {
    const node = await prisma.node.findUnique({ where: { id } });
    if (!node) {
      return node;
    }
    return new NodeEntity(nodeMapper(node), node.id);
  }
}
