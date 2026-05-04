import { NodeUnknownError } from '@/shared/domain/interface/error.interface.js';
import type { IRootNodeRepository } from '../domain/interface/node.interface.js';
import { NodeFactory } from '../domain/service/nodeFactory.service.js';
import type { NodeEntity } from '../domain/entity/node.entity.js';

export class TreeFactory {
  constructor(
    private readonly repository: IRootNodeRepository,
    private readonly nodeFactory: NodeFactory,
  ) {}

  public async buildChildEntities(nodeId: string): Promise<NodeEntity[]> {
    const childEntities = await this.repository.getChildNodes(nodeId);
    const result = await Promise.allSettled(
      childEntities.map((childEntity) => {
        const childAggregate =
          this.nodeFactory.newNodeAggregateByEntity(childEntity);
        this.repository
          .getNodeContextByNodeId(childEntity.id)
          .then((context) => {
            if (context) {
              childAggregate.setNodeContext(context);
            }
          });
        this.buildChildEntities(childEntity.id);
      }),
    );
    if (result.some((r) => r.status === 'rejected')) {
      throw new NodeUnknownError('Failed to build child entities');
    }
    return childEntities;
  }
}
export class GetTree {
  constructor(private readonly repository: IRootNodeRepository) {}

  async execute(projectId: string) {
    const rootNodeEntity = await this.repository.getByProjectId(projectId);
    if (!rootNodeEntity) {
      return rootNodeEntity;
    }
    const nodeFactory = new NodeFactory(rootNodeEntity);
    const rootNodeAggregate = nodeFactory.rootNodeAggregate;
    const treeFactory = new TreeFactory(this.repository, nodeFactory);
    const childEntities = await treeFactory.buildChildEntities(
      rootNodeAggregate.id,
    );
    for (const childEntity of childEntities) {
      rootNodeAggregate.addChildNode(childEntity.id);
    }
    return nodeFactory.printTree();
  }
}
