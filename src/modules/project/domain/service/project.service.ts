import { BaseService } from '@/shared/domain/service/base.service.js';
import {
  projectEntity,
  projectProviderEntity,
  type Project,
  type ProjectProvider,
} from '../entity/project.entity.js';
import type { IProjectRepository } from '../interface/project.interface.js';

export class ProjectService extends BaseService<Project, ProjectProvider> {
  constructor(
    repository: IProjectRepository,
    protected userId: string,
  ) {
    super(repository, projectEntity.extend(projectProviderEntity.shape));
  }

  public async getProjectById(id: string) {
    const project = await this.getById(id);

    if (!project) {
      throw new Error('Project not found');
    }

    if (project.userId !== this.userId) {
      throw new Error('Unauthorized access to project');
    }

    return project;
  }

  public async createProject(params: Project) {
    return await this.create(params);
  }
}
