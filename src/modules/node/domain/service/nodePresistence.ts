import type {
  NodeFull,
  RootNodeFull,
} from '@/node/domain/schema/node.schema.js';
import type { NodeContextFull } from '@/node/domain/schema/nodeContext.schema.js';
import type {
  INodePersistentService,
  IRootNodePersistentService,
} from '@/node/domain/interface/node.interface.js';

export class RootNodePersistentService implements IRootNodePersistentService {
  private nextServices: INodePersistentService[] = [];

  constructor(
    protected data: {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      depth: number;
      projectId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    },
  ) {}

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
  private context?: {
    rootNodeId: string;
    intentSummary: string;
    constraints: string[];
    successSignals: string[];
    pathFromRoot: string[];
    nodeId: string;
    id: string;
    createdAt: Date;
    updatedAt?: Date | undefined;
  };
  private nextServices: INodePersistentService[] = [];
  constructor(
    protected data: {
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
      type: 'BUILDING' | 'CONCEPT';
      goal: string;
      blocker: string;
      depth: number;
      parentId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    },
  ) {}
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
