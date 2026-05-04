import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { NodeEntity } from '../entity/node.entity.js';
import type { nodeSchema } from '../schema/node.schema.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';

export class NodeAggregate extends AggregateRoot<typeof nodeSchema> {
  private _childIds: string[] = [];
  private _nodeContext: NodeContextEntity | undefined;
  constructor(nodeEntity: NodeEntity) {
    super(nodeEntity);
  }

  public get nodeContext(): NodeContextEntity | undefined {
    return this._nodeContext;
  }

  public setNodeContext(context: NodeContextEntity) {
    this._nodeContext = context;
  }

  public addChildNode(id: string): void {
    this._childIds.push(id);
  }

  public get childNodes(): string[] {
    return this._childIds;
  }
}
