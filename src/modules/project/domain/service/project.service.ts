import type z from 'zod';
import type {
  Project,
  projectEntity,
  projectProviderEntity,
  ProjectFull,
} from '../entity/project.entity.js';
import type { IProjectRepository } from '../interface/project.interface.js';
import { BaseService } from '@/shared/domain/service/base.service.js';

export class ProjectService extends BaseService<Project, ProjectFull> {
  constructor(protected readonly userId: string) {
    super();
  }

  public isAuthorized(): boolean {
    const projectUserId = this.getFullEntity()?.userId;
    return !!projectUserId && projectUserId === this.userId;
  }
}

export class ProjectCollectionService {
  constructor(
    protected readonly repository: IProjectRepository,
    protected readonly userId: string,
  ) {}

  public async createProject(
    params: z.infer<typeof projectEntity>,
  ): Promise<ProjectService> {
    const newProject = await this.repository.createProject(
      this.userId,
      params,
    );
    const projectService = new ProjectService(this.userId);
    projectService.setFullEntity(newProject);
    return projectService;
  }

  public async acquireProjectById(
    id: z.infer<typeof projectProviderEntity.shape.id>,
  ): Promise<ProjectService> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    const projectService = new ProjectService(this.userId);
    projectService.setFullEntity(project);
    if (!projectService.isAuthorized()) {
      throw new Error('User is not authorized to access this project');
    }
    return projectService;
  }

  public async acquireProjectsByPage(
    page: number,
    pageSize: number,
  ): Promise<ProjectFull[]> {
    return this.repository.getUserProjectsByPage(this.userId, page, pageSize);
  }
}
