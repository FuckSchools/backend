import { prisma } from '@/config/prisma.js';
import type {
  INodeRepository,
  IRootNodeRepository,
} from '../../domain/interface/node.interface.js';
import {
  type RootNode,
  type RootNodeFull,
} from '@/node/domain/entity/node.entity.js';
import type {
  Node,
  NodeFull,
  NodeRepositoryType,
  RootNodeRepositoryType,
} from '@/node/domain/entity/node.entity.js';

const nodeRepositoryMapper = (node: NodeRepositoryType): NodeFull => {
  return {
    ...node,
    blocker: node.blocker || '',
    parentId: node.parentId || '',
  };
};

const rootNodeRepositoryMapper = (
  rootNode: RootNodeRepositoryType,
): RootNodeFull => {
  return { ...rootNode, projectId: rootNode.projectId || '' };
};

export class RootNodeRepository implements IRootNodeRepository {
  async create(projectId: string, params: RootNode): Promise<RootNodeFull> {
    return rootNodeRepositoryMapper(
      await prisma.node.create({
        data: { ...params, project: { connect: { id: projectId } } },
      }),
    );
  }
  async getByProjectId(projectId: string): Promise<RootNodeFull | null> {
    const rootNode = await prisma.node.findUnique({ where: { projectId } });
    return rootNode ? rootNodeRepositoryMapper(rootNode) : rootNode;
  }
  async update(rootNodeId: string, params: RootNode): Promise<RootNodeFull> {
    const updatedRootNode = await prisma.node.update({
      where: { id: rootNodeId },
      data: params,
    });
    return rootNodeRepositoryMapper(updatedRootNode);
  }
}

export class NodeRepository implements INodeRepository {
  async create(parentNodeId: string, params: Node): Promise<NodeFull> {
    return nodeRepositoryMapper(
      await prisma.node.create({
        data: { ...params, parent: { connect: { id: parentNodeId } } },
      }),
    );
  }
  async getChildren(parentNodeId: string): Promise<Array<NodeFull>> {
    const children = await prisma.node.findMany({
      where: { parentId: parentNodeId },
    });
    return children.map((child) => nodeRepositoryMapper(child));
  }
  async update(nodeId: string, params: Node): Promise<NodeFull> {
    const updatedNode = await prisma.node.update({
      where: { id: nodeId },
      data: params,
    });
    return nodeRepositoryMapper(updatedNode);
  }
}
