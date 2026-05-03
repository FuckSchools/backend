import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { rootNodeSchema } from '../schema/node.schema.js';
import type { NodeEntity, RootNodeEntity } from '../entity/node.entity.js';

export class RootNodeAggregate extends AggregateRoot<typeof rootNodeSchema> {
  private _nodes: NodeEntity[] = [];
  constructor(data: RootNodeEntity) {
    super(data);
  }

  public addNode(node: NodeEntity): void {
    this._nodes.push(node);
  }

  public get nodes(): NodeEntity[] {
    return this._nodes;
  }
}
