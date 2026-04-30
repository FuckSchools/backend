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
} from '../interface/node.interface.js';

export class NodeService extends BaseService<Node, NodeFull> {
  constructor(
    protected repository: INodeRepository,
    parentNodeId: string,
  ) {
    super();
    this.setFormerEntityId(parentNodeId);
  }

  public async createNode(): Promise<boolean> {
    const parentNodeId = this.getFormerEntityId();
    const node = this.getEntity();
    if (!parentNodeId || !node) {
      return false;
    }
    const newNode = await this.repository.create(parentNodeId, node);
    this.setFullEntity(newNode);
    return true;
  }

  public async getChildren(): Promise<NodeFull[] | undefined> {
    const nodeId = this.getFullEntity()?.id;
    if (!nodeId) {
      return undefined;
    }
    const children = await this.repository.getChildren(nodeId);
    return children;
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
}
