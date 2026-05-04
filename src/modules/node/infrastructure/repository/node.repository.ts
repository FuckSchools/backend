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
import { NotFoundError } from '@/shared/domain/interface/error.interface.js';
import { NodeContextEntity } from '@/node/domain/entity/nodeContext.entity.js';

const getChildNodes = async (nodeId: string): Promise<NodeEntity[]> => {
  const parentNode = await prisma.node.findUnique({
    where: { id: nodeId },
    include: { childNodes: true },
  });
  if (!parentNode) {
    throw new NotFoundError(`Parent node with id ${nodeId} not found`);
  }
  if (parentNode.childNodes.length === 0) {
    return [];
  }
  return parentNode.childNodes.map(
    (childNode) => new NodeEntity(nodeMapper(childNode), childNode.id),
  );
};

const saveNode = async (data: NodeEntity) => {
  await prisma.node.update({
    where: { id: data.data.parentId },
    data: { childNodes: { create: { ...data.data, id: data.id } } },
  });
};

const saveRootNode = async (data: RootNodeEntity) => {
  await prisma.project.update({
    where: { id: data.data.projectId },
    data: { rootNode: { create: { ...data.data, id: data.id } } },
  });
};

export class RootNodeRepository implements IRootNodeRepository {
  async getByProjectId(projectId: string): Promise<RootNodeEntity | null> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { rootNode: true },
    });
    if (!project) {
      throw new NotFoundError(`Project with id ${projectId} not found`);
    }
    if (!project.rootNode) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }
    return new RootNodeEntity(
      rootNodeMapper(project.rootNode),
      project.rootNode.id,
    );
  }
  async save<T extends RootNodeEntity | NodeEntity>(data: T): Promise<void> {
    if (data instanceof RootNodeEntity) {
      await saveRootNode(data);
    } else if (data instanceof NodeEntity) {
      await saveNode(data);
    }
  }
  async getById(id: string): Promise<RootNodeEntity | null> {
    const rootNode = await prisma.node.findUnique({ where: { id } });
    if (!rootNode) {
      return rootNode;
    }
    return new RootNodeEntity(rootNodeMapper(rootNode), rootNode.id);
  }
  async getChildNodes(nodeId: string): Promise<NodeEntity[]> {
    return await getChildNodes(nodeId);
  }
}

export class NodeRepository implements INodeRepository {
  async getChildNodes(nodeId: string): Promise<NodeEntity[]> {
    return await getChildNodes(nodeId);
  }
  async getNodeContextByNodeId(
    nodeId: string,
  ): Promise<NodeContextEntity | null> {
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: { context: true },
    });
    if (!node || !node.context) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }
    return new NodeContextEntity(node.context, node.context.id);
  }
  async save(data: NodeEntity): Promise<void> {
    await saveNode(data);
  }
  async getById(id: string): Promise<NodeEntity | null> {
    const node = await prisma.node.findUnique({ where: { id } });
    if (!node) {
      return node;
    }
    return new NodeEntity(nodeMapper(node), node.id);
  }
}
