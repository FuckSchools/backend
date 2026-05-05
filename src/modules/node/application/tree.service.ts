import type { IRootNodeRepository } from '../domain/interface/node.interface.js';
import {
  NodeFactory,
  NodeHandler,
} from '../domain/service/nodeFactory.service.js';
import type {
  NodeEntity,
  RootNodeEntity,
} from '../domain/entity/node.entity.js';
import {
  NotFoundError,
  NodeUnknownError,
} from '@/shared/domain/interface/error.interface.js';

export class TreeHandler {
  private _nodeFactory: NodeFactory | undefined;
  constructor(public readonly repository: IRootNodeRepository) {}

  private async getTree(
    handler: NodeHandler,
    nodeEntity: NodeEntity | RootNodeEntity,
    ancestorIds = new Set<string>(),
  ) {
    const currentIds = new Set(ancestorIds);
    currentIds.add(nodeEntity.id);

    const childEntities = await this.repository.getChildNodes(nodeEntity.id);
    for (const childEntity of childEntities) {
      if (currentIds.has(childEntity.id)) {
        throw new NodeUnknownError(
          'Cycle detected while rebuilding the node tree at ' + childEntity.id,
        );
      }

      const childHandler = handler.stepDown(childEntity);
      await this.getTree(childHandler, childEntity, currentIds);
    }
  }

  public async resumeExistingNodeFactoryByProjectId(projectId: string) {
    const rootNodeEntity = await this.repository.getByProjectId(projectId);
    if (!rootNodeEntity) {
      return;
    }
    this._nodeFactory = new NodeFactory(rootNodeEntity);
    const rootNodeAggregate = this._nodeFactory.rootNodeAggregate;
    const nodeHandler = new NodeHandler(this._nodeFactory, rootNodeAggregate);
    await this.getTree(nodeHandler, rootNodeEntity);
  }

  public get nodeFactory(): NodeFactory | undefined {
    return this._nodeFactory;
  }

  public async createRootNode(rootNodeEntity: RootNodeEntity): Promise<void> {
    await this.repository.save(rootNodeEntity);
    this._nodeFactory = new NodeFactory(rootNodeEntity);
  }

  public async createNode(nodeEntity: NodeEntity): Promise<void> {
    if (nodeEntity.data.parentId === nodeEntity.id) {
      throw new NodeUnknownError('A node cannot be its own parent.');
    }

    if (!this._nodeFactory) {
      throw new NotFoundError(
        'Root node factory not found. Please create root node first.',
      );
    }
    await this.repository.save(nodeEntity);
    const nodeHandler = new NodeHandler(
      this._nodeFactory,
      this._nodeFactory.getNodeAggregateById(nodeEntity.data.parentId),
    );
    nodeHandler.stepDown(nodeEntity);
  }
}
