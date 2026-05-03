import { BaseService } from '@/shared/domain/service/base.service.js';
import type {
  Node,
  NodeFull,
  RootNode,
  RootNodeFull,
} from '../schema/node.schema.js';
import type {
  INodeRepository,
  IRootNodeRepository,
} from '../interface/node.interface.js';
import { NodeContextService } from './nodeContext.service.js';

export class NodeService extends BaseService<Node, NodeFull> {
  constructor(
    protected repository: INodeRepository,
    parentNodeId: string,
    protected nodeId?: string,
    protected isRootNode: boolean = false,
  ) {
    super();
    this.setFormerEntityId(parentNodeId);
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
    const parentNodeId = this.getFormerEntityId();
    const node = this.getEntity();
    if (!parentNodeId || !node) {
      return false;
    }
    const newNode = await this.repository.create(parentNodeId, node);
    this.setFullEntity(newNode);
    return true;
  }

  public async getChildren(): Promise<NodeService[]> {
    const nodeId = this.getFullEntity()?.id || this.nodeId;
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
      return childNodeService;
    });
  }

  public newChildNodeService(): NodeService {
    const nodeId = this.getFullEntity()?.id || this.nodeId;
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
    const nodeId = this.getFullEntity()?.id || this.nodeId;
    if (!nodeId) {
      throw new Error(
        'Current Node is not hydrated yet, cannot get node context service',
      );
    }
    const nodeContextService = new NodeContextService(
      this.repository.getNodeContextRepository(),
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
    protected repository: IRootNodeRepository,
    projectId: string,
  ) {
    super();
    this.setFormerEntityId(projectId);
  }

  public async getRootNode(): Promise<boolean> {
    const projectId = this.getFormerEntityId();
    if (!projectId) {
      return false;
    }
    const rootNode = await this.repository.getByProjectId(projectId);
    if (!rootNode) {
      return false;
    }
    this.setFullEntity(rootNode);
    return true;
  }

  public async createRootNode(): Promise<boolean> {
    const projectId = this.getFormerEntityId();
    const rootNode = this.getEntity();
    if (!projectId || !rootNode) {
      return false;
    }
    const newRootNode = await this.repository.create(projectId, rootNode);
    this.setFullEntity(newRootNode);
    return true;
  }

  public getRootNodeAsNode(): NodeService {
    const rootNode = this.getFullEntity();
    const projectId = this.getFormerEntityId();
    if (!rootNode || !projectId) {
      throw new Error('Root node is not hydrated yet, cannot normalize');
    }

    return new NodeService(
      this.repository.getNodeRepository(),
      projectId,
      rootNode.id,
      true,
    );
  }

  public newChildNodeService(): NodeService {
    const rootNode = this.getFullEntity();
    const projectId = this.getFormerEntityId();
    if (!rootNode || !projectId) {
      throw new Error('Root node is not hydrated yet, cannot normalize');
    }
    return new NodeService(this.repository.getNodeRepository(), rootNode.id);
  }
}
