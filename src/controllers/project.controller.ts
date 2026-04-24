import { getInjection } from '@/DI/repository.js';
import { createProjectUseCase } from '@/applications/project/createProject.js';
import { getProjectUseCase } from '@/applications/project/getProject.js';
import { projectEntity } from '@/entities/project.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import express from 'express';

const projectRepository = getInjection('ProjectRepository');

export const createProjectController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const title = await projectEntity.shape.internal.shape.title.parseAsync(
      req.body['title'],
    );

    const createdProject = await createProjectUseCase(projectRepository)(
      userId,
      title,
    );

    res.status(201).json(createdProject);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ createProjectController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProjectController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const projectId = await projectEntity.shape.internal.shape.id.parseAsync(
      req.params['projectId'],
    );

    const project = await getProjectUseCase(projectRepository)(
      projectId,
      userId,
    );

    res.status(200).json(project);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ getProjectController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
