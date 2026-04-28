import { ProjectService } from '../domain/service/project.service.js';
import { ProjectRepository } from '../infrastructure/repository/project.repository.js';

export const getProject = async (projectId: string, userId: string) => {
  const projectService = new ProjectService(new ProjectRepository(), userId);
  return await projectService.getProjectById(projectId);
};
