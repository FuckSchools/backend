import type { IRootNodeRepository } from '../domain/interface/node.interface.js';
import {
  NodeFactory,
  NodeHandler,
} from '../domain/service/nodeFactory.service.js';
import type {
  NodeEntity,
  RootNodeEntity,
} from '../domain/entity/node.entity.js';
import { NotFoundError } from '@/shared/domain/interface/error.interface.js';
export class TreeHandler {
  private _nodeFactory: NodeFactory | undefined;
  constructor(public readonly repository: IRootNodeRepository) {}

  private async getTree(
    handler: NodeHandler,
    nodeEntity: NodeEntity | RootNodeEntity,
  ) {
    const childEntities = await this.repository.getChildNodes(nodeEntity.id);
    const children = childEntities.map((childEntity) => {
      return {
        handler: handler.stepDown(childEntity),
        nodeEntity: childEntity,
      };
    });
    await Promise.all(
      children.map(
        async (child) => await this.getTree(child.handler, child.nodeEntity),
      ),
    );
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
