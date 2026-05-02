import { BaseService } from '@/shared/domain/service/base.service.js';
import type {
  Node,
  NodeFull,
  RootNode,
  RootNodeFull,
} from '../entity/node.entity.js';
import type {
  INodeRepository,
  IRootNodeRepository,
  NodeWithContext,
} from '../interface/node.interface.js';
import { NodeContextService } from './nodeContext.service.js';

export class NodeService extends BaseService<Node, NodeFull> {
  private cachedContext: NodeWithContext['context'];

  constructor(
    protected readonly repository: INodeRepository,
    protected readonly parentNodeId: string,
    protected readonly nodeId?: string,
    protected readonly isRootNode = false,
  ) {
    super();
  }

  public getCachedContext(): NodeWithContext['context'] {
    return this.cachedContext;
  }

  public async createNode(): Promise<boolean> {
    if (this.isRootNode) {
      throw new Error(
        'Cannot create node with NodeService, use RootNodeService instead',
      );
    }
    if (this.nodeId) {
      return false;
    }
    const node = this.getEntity();
    if (!node) {
      return false;
    }
    const newNode = await this.repository.create(this.parentNodeId, node);
    this.setFullEntity(newNode);
    return true;
  }

  public async getChildren(): Promise<NodeService[]> {
    const nodeId = this.getFullEntity()?.id ?? this.nodeId;
    if (!nodeId) {
      throw new Error('Current Node is not hydrated yet, cannot get children');
    }
    const children = await this.repository.getChildren(nodeId);
    return children.map((child) => {
      const childNodeService = new NodeService(
        this.repository,
        nodeId,
        child.id,
      );
      childNodeService.setFullEntity(child);
      childNodeService.cachedContext = child.context;
      return childNodeService;
    });
  }

  public newChildNodeService(): NodeService {
    const nodeId = this.getFullEntity()?.id ?? this.nodeId;
    if (!nodeId) {
      throw new Error(
        'Current Node is not hydrated yet, cannot create child node service',
      );
    }
    return new NodeService(this.repository, nodeId);
  }

  public async getNodeContextService(): Promise<{
    nodeContextService: NodeContextService;
    existed: boolean;
  }> {
    if (this.isRootNode) {
      throw new Error('Cannot get node context service for root node');
    }
    const nodeId = this.getFullEntity()?.id ?? this.nodeId;
    if (!nodeId) {
      throw new Error(
        'Current Node is not hydrated yet, cannot get node context service',
      );
    }
    const nodeContextService = new NodeContextService(
      this.repository.getContextRepository(),
      nodeId,
    );
    return {
      nodeContextService,
      existed: await nodeContextService.getNodeContext(),
    };
  }
}

export class RootNodeService extends BaseService<RootNode, RootNodeFull> {
  constructor(
    protected readonly repository: IRootNodeRepository,
    protected readonly projectId: string,
  ) {
    super();
  }

  public async getRootNode(): Promise<boolean> {
    const rootNode = await this.repository.getByProjectId(this.projectId);
    if (!rootNode) {
      return false;
    }
    this.setFullEntity(rootNode);
    return true;
  }

  public async createRootNode(): Promise<boolean> {
    const rootNode = this.getEntity();
    if (!rootNode) {
      return false;
    }
    const newRootNode = await this.repository.create(this.projectId, rootNode);
    this.setFullEntity(newRootNode);
    return true;
  }

  public getRootNodeAsNode(): NodeService {
    const rootNode = this.getFullEntity();
    if (!rootNode) {
      throw new Error('Root node is not hydrated yet, cannot normalize');
    }

    return new NodeService(
      this.repository.getNodeRepository(),
      this.projectId,
      rootNode.id,
      true,
    );
  }

  public newChildNodeService(): NodeService {
    const rootNode = this.getFullEntity();
    if (!rootNode) {
      throw new Error('Root node is not hydrated yet, cannot normalize');
    }
    return new NodeService(this.repository.getNodeRepository(), rootNode.id);
  }
}
