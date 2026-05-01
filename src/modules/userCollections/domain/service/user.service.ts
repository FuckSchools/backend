import type z from 'zod';
import { userProviderEntity } from '../entity/user.entity.js';
import type {
  Project,
  projectEntity,
  ProjectFull,
  projectProviderEntity,
} from '../entity/project.entity.js';
import type { IUserCollectionRepository } from '../interface/project.interface.js';
import { BaseService } from '@/shared/domain/service/base.service.js';

export class ProjectService extends BaseService<Project, ProjectFull> {
  public isAuthorized(): boolean {
    const incomingUserId = this.getFullEntity()?.userId;
    const formerUserId = this.getFormerEntityId();
    if (!incomingUserId || !formerUserId) {
      return false;
    }
    return incomingUserId === formerUserId;
  }
}

export class UserCollectionService {
  constructor(
    protected repository: IUserCollectionRepository,
    protected userId: z.infer<typeof userProviderEntity.shape.id>,
  ) {}

  public async createProject(
    params: z.infer<typeof projectEntity>,
  ): Promise<ProjectService> {
    const newProject = await this.repository.createProject(this.userId, params);
    const projectService = new ProjectService();
    projectService.setFormerEntityId(this.userId);
    projectService.setFullEntity(newProject);
    return projectService;
  }

  public async acquireProjectById(
    id: z.infer<typeof projectProviderEntity.shape.id>,
  ): Promise<ProjectService> {
    const project = await this.repository.getProjectById(id);
    if (project) {
      const projectService = new ProjectService();
      projectService.setFormerEntityId(this.userId);
      projectService.setFullEntity(project);
      if (!projectService.isAuthorized()) {
        throw new Error('User is not authorized to access this project');
      }
      return projectService;
    }
    throw new Error('Project not found');
  }

  public async acquireProjectsByPage(
    page: number,
    pageSize: number,
  ): Promise<ProjectFull[]> {
    return await this.repository.getUserProjectsByPage(
      this.userId,
      page,
      pageSize,
    );
  }

  public async acquireProjectServicesByPage(
    page: number,
    pageSize: number,
  ): Promise<ProjectService[]>
  {
    const projects = await this.acquireProjectsByPage(page, pageSize);
    return projects.map((project) => {
      const projectService = new ProjectService();
      projectService.setFormerEntityId(this.userId);
      projectService.setFullEntity(project);
      return projectService;
    });
  }
}
