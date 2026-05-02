import type {
  NodeFull,
  RootNodeFull,
} from '@/node/domain/entity/node.entity.js';
import type { NodeContextFull } from '@/node/domain/entity/nodeContext.entity.js';
import type {
  INodePersistentService,
  IRootNodePersistentService,
} from '@/node/domain/interface/node.interface.js';

export class RootNodePersistentService implements IRootNodePersistentService {
  private nextServices: INodePersistentService[] = [];

  constructor(protected data: RootNodeFull) {}

  appendNext(next: INodePersistentService): void {
    this.nextServices.push(next);
  }
  next(): INodePersistentService[] {
    return this.nextServices;
  }
  output(): RootNodeFull & {
    childNodes: Array<ReturnType<INodePersistentService['output']>>;
  } {
    return {
      ...this.data,
      childNodes: this.nextServices.map((service) => service.output()),
    };
  }
}

export class NodePersistentService implements INodePersistentService {
  private context?: NodeContextFull;
  private nextServices: INodePersistentService[] = [];
  constructor(protected data: NodeFull) {}
  getContext(): NodeContextFull | undefined {
    return this.context;
  }
  next(): INodePersistentService[] {
    return this.nextServices;
  }
  saveContext(context: NodeContextFull): void {
    this.context = context;
  }
  appendNext(next: INodePersistentService): void {
    this.nextServices.push(next);
  }
  output(): NodeFull & {
    childNodes: Array<ReturnType<INodePersistentService['output']>>;
    context?: NodeContextFull;
  } {
    const childNodes = this.nextServices.map((service) => service.output());
    return {
      ...this.data,
      ...(this.context ? { context: this.context } : {}),
      childNodes,
    };
  }
}
