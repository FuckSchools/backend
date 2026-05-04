import { prisma } from '@/config/prisma.js';
import { ProjectEntity } from '@/userCollections/domain/entity/project.entity.js';
import { UserEntity } from '@/userCollections/domain/entity/user.entity.js';
import type { IUserRepository } from '@/userCollections/domain/interface/repository.interface.js';
import { errAsync, okAsync, type ResultAsync } from 'neverthrow';

export class UserRepository implements IUserRepository {
  async createProject(
    project: ProjectEntity,
    userId: string,
  ): Promise<ResultAsync<void, string>> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { projects: { create: { ...project.data, id: project.id } } },
      });
      return okAsync(undefined as void);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getProjectById(
    projectId: string,
    userId: string,
  ): Promise<ResultAsync<ProjectEntity | null, string>> {
    try {
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
      });
      if (!project) {
        // eslint-disable-next-line unicorn/no-null
        return okAsync(null);
      }
      const projectEntity = new ProjectEntity(project, project.id);
      return okAsync(projectEntity);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getProjectsByUserId(
    userId: string,
  ): Promise<ResultAsync<ProjectEntity[], string>> {
    try {
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
      return okAsync(projectEntities);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async save(data: UserEntity): Promise<ResultAsync<void, string>> {
    try {
      await prisma.user.create({ data: { ...data.data, id: data.id } });
      return okAsync(undefined as void);
    } catch (error) {
      return errAsync(String(error));
    }
  }
  async getById(
    clerkId: string,
  ): Promise<ResultAsync<UserEntity | null, string>> {
    try {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        // eslint-disable-next-line unicorn/no-null
        return okAsync(null);
      }
      const userEntity = new UserEntity(user, user.id);
      return okAsync(userEntity);
    } catch (error) {
      return errAsync(String(error));
    }
  }
}
