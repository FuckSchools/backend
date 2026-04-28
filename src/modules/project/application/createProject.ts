import { ProjectService } from '../domain/service/project.service.js';
import { ProjectRepository } from '../infrastructure/repository/project.repository.js';

export const createProject = async (title: string, userId: string) => {
  const projectService = new ProjectService(new ProjectRepository(), userId);
  return await projectService.createProject({ title });
};
