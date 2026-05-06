import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import type { nodeTransitionSchema } from '../schema/nodeState.schema.js';
import type {
  NodeStateEntity,
  NodeTransitionStateEntity,
  RootNodeStateEntity,
} from '../entity/nodeState.entity.js';
import { IllegalOperationError } from '@/shared/domain/interface/error.interface.js';

export class NodeTransitionAggregate<
  T extends NodeStateEntity | RootNodeStateEntity,
> extends AggregateRoot<typeof nodeTransitionSchema> {
  private _transitionFromState: T | undefined;
  private _transitionToState: T | undefined;
  constructor(data: NodeTransitionStateEntity) {
    super(data);
  }

  public setTransitionFromState(state: T) {
    this._transitionFromState = state;
  }

  public setTransitionToState(state: T) {
    this._transitionToState = state;
  }

  public get transitionFromState(): T | undefined {
    return this._transitionFromState;
  }

  public get transitionToState(): T | undefined {
    return this._transitionToState;
  }

  public validateStateType(): boolean {
    if (!this._transitionFromState || !this._transitionToState) {
      throw new IllegalOperationError(
        'Both transition states must be set before validation.',
      );
    }
    return typeof this._transitionFromState === typeof this._transitionToState;
  }
}
