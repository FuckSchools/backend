import type z from 'zod';
import { userProviderEntity } from '../entity/user.entity.js';
import type {
  Project,
  projectEntity,
  ProjectFull,
  projectProviderEntity,
} from '../entity/project.entity.js';
import type { IUserCollectionRepository } from '../interface/project.interface.js';

export class ProjectService {
  protected entity: Project | undefined;
  protected fullEntity: ProjectFull | undefined;

  constructor(protected userId: z.infer<typeof userProviderEntity.shape.id>) {}

  public isAuthorized(): boolean {
    return this.fullEntity?.userId === this.userId;
  }
  public setEntity(entity: Project): void {
    this.entity = entity;
  }

  public setFullEntity(fullEntity: ProjectFull): void {
    this.fullEntity = fullEntity;
    this.entity = fullEntity;
  }

  public getFullEntity(): ProjectFull | undefined {
    return this.fullEntity;
  }
}
export class UserCollectionService {
  projectService: ProjectService[] = [];
  constructor(
    protected repository: IUserCollectionRepository,
    protected userId: z.infer<typeof userProviderEntity.shape.id>,
  ) {}

  public async createProject(
    params: z.infer<typeof projectEntity>,
  ): Promise<boolean> {
    const newProject = await this.repository.createProject(this.userId, params);
    const projectService = new ProjectService(this.userId);
    projectService.setFullEntity(newProject);
    this.projectService.push(projectService);
    return true;
  }

  public async acquireProjectById(
    id: z.infer<typeof projectProviderEntity.shape.id>,
  ): Promise<boolean> {
    const userId = this.userId;
    if (!userId) {
      return false;
    }
    const project = await this.repository.getProjectById(id);
    if (project) {
      const projectService = new ProjectService(userId);
      projectService.setFullEntity(project);
      if (!projectService.isAuthorized()) {
        return false;
      }
      this.projectService.push(projectService);
      return true;
    }
    return false;
  }

  public async acquireProjectsByPage(
    page: number,
    pageSize: number,
  ): Promise<boolean> {
    const projects = await this.repository.getUserProjectsByPage(
      this.userId,
      page,
      pageSize,
    );
    for (const project of projects) {
      const projectService = new ProjectService(this.userId);
      projectService.setFullEntity(project);
      this.projectService.push(projectService);
    }
    return true;
  }

  public getProjectServices(): ProjectService[] {
    return this.projectService;
  }
}
