import { prisma } from '@/config/prisma.js';
import { ProjectEntity } from '@/userCollections/domain/entity/project.entity.js';
import { UserEntity } from '@/userCollections/domain/entity/user.entity.js';
import type { IUserRepository } from '@/userCollections/domain/interface/repository.interface.js';
import { errAsync, ok, type ResultAsync } from 'neverthrow';

export class UserRepository implements IUserRepository {
  async createProject(project: ProjectEntity, userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { projects: { create: { ...project.data, id: project.id } } },
    });
  }
  async getProjectById(
    projectId: string,
    userId: string,
  ): Promise<ProjectEntity | null> {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      return project;
    }
    const projectEntity = new ProjectEntity(project, project.id);
    return projectEntity;
  }
  async getProjectsByUserId(
    userId: string,
  ): Promise<ResultAsync<ProjectEntity[], string>> {
    const projects = await prisma.user.findUnique({
      where: { id: userId },
      include: { projects: true },
    });
    if (!projects) {
      return errAsync('User not found.');
    }
    const projectEntities: ProjectEntity[] = [];
    for (const project of projects.projects) {
      const projectEntity = new ProjectEntity(project, project.id);
      projectEntities.push(projectEntity);
    }
    return ok(projectEntities);
  }
  async save(data: UserEntity): Promise<void> {
    await prisma.user.create({ data: { ...data.data, id: data.id } });
  }
  async getById(clerkId: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return user;
    }
    const userEntity = new UserEntity(user, user.id);
    return userEntity;
  }
}
