import { getInjection } from '@/DI/repository.js';
import { createProjectUseCase } from '@/applications/project/createProject.js';
import { getProjectUseCase } from '@/applications/project/getProject.js';
import { getAllUserProjectsUseCase } from '@/applications/user/getAllUserProjects.js';
import { projectEntity } from '@/entities/project.entity.js';
import express from 'express';

const projectRepository = getInjection('ProjectRepository');
const userRepository = getInjection('UserRepository');

export const createProjectController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = res.locals['userId'];
    const title = await projectEntity.shape.internal.shape.title.parseAsync(
      req.body['title'],
    );

    const createdProject = await createProjectUseCase(projectRepository)({
      userId,
      title,
    });

    res.status(201).json(createdProject);
  } catch (error) {
    console.error('🚀 ~ createProjectController ~ error:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProjectController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const projectId = await projectEntity.shape.internal.shape.id.parseAsync(
      req.params['projectId'],
    );

    const existingProjects = await getAllUserProjectsUseCase(userRepository)({
      userId: res.locals['userId'],
    });

    if (!existingProjects.some((project) => project.id === projectId)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const project = await getProjectUseCase(projectRepository)({ projectId });

    res.status(200).json(project);
  } catch (error) {
    console.error('🚀 ~ getProjectController ~ error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
