import express from 'express';
import { createProject } from '../application/createProject.js';
import { getProject, getProjects } from '../application/getProject.js';
import { UserCollectionRepository } from '../infrastructure/repository/user.repository.js';

export const createProjectController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = res.locals['userId'];
    const title = req.body['title'];

    const createdProject = await createProject(new UserCollectionRepository())(
      title,
      userId,
    );

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
    const projectId = req.params['projectId'] as string;
    const userId = res.locals['userId'];

    if (projectId) {
      const project = await getProject(new UserCollectionRepository())(
        projectId,
        userId,
      );
      res.status(200).json(project);
    } else {
      const page = Number.parseInt(req.query['page'] as string) || 1;
      const pageSize = Number.parseInt(req.query['pageSize'] as string) || 10;
      const projects = await getProjects(new UserCollectionRepository())(
        userId,
        page,
        pageSize,
      );
      res.status(200).json(projects);
    }
  } catch (error) {
    console.error('🚀 ~ getProjectController ~ error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
