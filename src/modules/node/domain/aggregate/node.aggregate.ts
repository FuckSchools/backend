import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { NodeEntity } from '../entity/node.entity.js';
import type { NodeContextEntity } from '../entity/nodeContext.entity.js';
import type { nodeSchema } from '../schema/node.schema.js';
import { err, ok, type Result } from 'neverthrow';

export class NodeAggregate extends AggregateRoot<typeof nodeSchema> {
  private _nodeContext: NodeContextEntity | undefined;
  constructor(nodeEntity: NodeEntity) {
    super(nodeEntity);
  }

  public createNodeContext(
    nodeContextEntity: NodeContextEntity,
  ): Result<void, string> {
    if (this._nodeContext) {
      return err('Node context already exists for this node.');
    }
    this._nodeContext = nodeContextEntity;
    return ok();
  }

  public get nodeContext(): NodeContextEntity | undefined {
    return this._nodeContext;
  }
}
