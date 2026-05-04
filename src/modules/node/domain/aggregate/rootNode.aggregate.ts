import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { rootNodeSchema } from '../schema/node.schema.js';
import type { RootNodeEntity } from '../entity/node.entity.js';

export class RootNodeAggregate extends AggregateRoot<typeof rootNodeSchema> {
  private _nodeIds: string[] = [];
  constructor(data: RootNodeEntity) {
    super(data);
  }

  public addChildNode(id: string): void {
    this._nodeIds.push(id);
  }

  public get nodes(): string[] {
    return this._nodeIds;
  }
}
