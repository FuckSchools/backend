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
    if (this._transitionFromState && this._transitionToState) {
      return (
        this._transitionFromState.schema === this._transitionToState.schema
      );
    }
    return true; // If one of the states is undefined, we consider it valid for now
  }

  public getDiff() {
    if (!this.validateStateType()) {
      throw new IllegalOperationError(
        'Transition states are of different types.',
      );
    }
    // TODO: implement diff interface with modification type (added, removed, updated) and path to the modified field
  }
}
