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

export class RootNodeService extends BaseService<RootNode, RootNodeProvider> {
  private isProjectIdValid: boolean = false;
  private rootNodeId: string | undefined;
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
    const rootNode = await this.repository.create( params, this.projectId );
    this.rootNodeId = rootNode.id;
    return rootNode;
  }
}

export class NodeService extends BaseService<Node, NodeProvider> {
  constructor(
    repository: INodeRepository,
    protected rootNodeService: RootNodeService,
  ) {
    super(repository, nodeEntity.extend(nodeProviderEntity.shape));
  }
}
