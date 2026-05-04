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
import { errAsync, okAsync, type ResultAsync } from 'neverthrow';

export class RootNodeRepository implements IRootNodeRepository {
  async getByProjectId(
    projectId: string,
  ): Promise<ResultAsync<RootNodeEntity | null, string>> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { rootNode: true },
      });
      if (!project || !project.rootNode) {
        // eslint-disable-next-line unicorn/no-null
        return okAsync(null);
      }
      return okAsync(
        new RootNodeEntity(
          rootNodeMapper(project.rootNode),
          project.rootNode.id,
        ),
      );
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async save(data: RootNodeEntity): Promise<ResultAsync<void, string>> {
    try {
      await prisma.project.update({
        where: { id: data.data.projectId, rootNode: {} },
        data: { ...data.data, id: data.id },
      });
      return okAsync(undefined as void);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getById(
    id: string,
  ): Promise<ResultAsync<RootNodeEntity | null, string>> {
    try {
      const rootNode = await prisma.node.findUnique({ where: { id } });
      if (!rootNode) {
        // eslint-disable-next-line unicorn/no-null
        return okAsync(null);
      }
      return okAsync(new RootNodeEntity(rootNodeMapper(rootNode), rootNode.id));
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getChildNodes(
    nodeId: string,
  ): Promise<ResultAsync<NodeEntity[], string>> {
    try {
      const parentNode = await prisma.node.findUnique({
        where: { id: nodeId },
        include: { childNodes: true },
      });
      if (!parentNode) {
        return errAsync(`Parent node with id ${nodeId} not found`);
      }
      if (parentNode.childNodes.length === 0) {
        return okAsync([]);
      }
      return okAsync(
        parentNode.childNodes.map(
          (childNode) => new NodeEntity(nodeMapper(childNode), childNode.id),
        ),
      );
    } catch (error) {
      return errAsync(String(error));
    }
  }
}

export class NodeRepository implements INodeRepository {
  async save(data: NodeEntity): Promise<ResultAsync<void, string>> {
    try {
      await prisma.node.update({
        where: { id: data.data.parentId },
        data: { childNodes: { create: { ...data.data, id: data.id } } },
      });
      return okAsync(undefined as void);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getById(id: string): Promise<ResultAsync<NodeEntity | null, string>> {
    try {
      const node = await prisma.node.findUnique({ where: { id } });
      if (!node) {
        // eslint-disable-next-line unicorn/no-null
        return okAsync(null);
      }
      return okAsync(new NodeEntity(nodeMapper(node), node.id));
    } catch (error) {
      return errAsync(String(error));
    }
  }
}
