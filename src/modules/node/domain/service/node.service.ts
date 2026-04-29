import { BaseService } from '@/shared/domain/service/base.service.js';
import {
  nodeEntity,
  nodeProviderEntity,
  rootNodeProviderEntity,
  type Node,
  type NodeProvider,
  type RootNode,
  type RootNodeProvider,
} from '../entity/node.entity.js';
import type {
  INodeRepository,
  IRootNodeRepository,
} from '../interface/node.interface.js';
import type { ProjectService } from '@/project/domain/service/project.service.js';
import { NodeRepository } from '@/node/infrastructure/repository/node.repository.js';

export class RootNodeService extends BaseService<RootNode, RootNodeProvider> {
  private isProjectIdValid: boolean = false;
  private rootNodeId: string | undefined;
  private directChildNodes: NodeService[] = [];
  constructor(
    repository: IRootNodeRepository,
    protected projectId: string,
  ) {
    super(repository, nodeEntity.extend(rootNodeProviderEntity.shape));
  }

  public async validateProjectId(projectService: ProjectService) {
    const project = await projectService.getProjectById(this.projectId);
    if (project) {
      this.isProjectIdValid = true;
    } else {
      throw new Error('Invalid project ID');
    }
  }

  public async createRootNode(params: RootNode) {
    if (!this.isProjectIdValid) {
      throw new Error('Project ID is not valid');
    }
    const rootNode = await this.repository.create(params, this.projectId);
    this.rootNodeId = rootNode.id;
    return rootNode;
  }

  public getRootNodeId() {
    return this.rootNodeId;
  }

  public getDepth() {
    return 0;
  }

  public newNode() {
    const nodeService = new NodeService(new NodeRepository(), 1);
    this.directChildNodes.push(nodeService);
    return nodeService;
  }
}

export class NodeService extends BaseService<Node, NodeProvider> {
  private data: (Node & NodeProvider) | undefined;
  private childNodes: NodeService[] = [];
  constructor(
    repository: INodeRepository,
    protected readonly depth: number,
    protected readonly parentNodeService?: NodeService,
  ) {
    super(repository, nodeEntity.extend(nodeProviderEntity.shape));
  }
  public newNode() {
    const nodeService = new NodeService(
      new NodeRepository(),
      this.depth + 1,
      this,
    );
    this.childNodes.push(nodeService);
    return nodeService;
  }

  public async setData(params: Omit<Node, 'depth'>) {
    this.data = await this.create({ ...params, depth: this.depth });
    return this.data;
  }

  public getData() {
    return this.data;
  }

  public getDepth() {
    return this.depth;
  }

  public prev() {
    return this.parentNodeService;
  }
}
