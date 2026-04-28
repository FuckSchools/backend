import express from 'express';
import { createProject } from '../application/createProject.js';
import { getProject } from '../application/getProject.js';

export const createProjectController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = res.locals['userId'];
    const title = req.body['title'];

    const createdProject = await createProject(title, userId);

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

    const project = await getProject(projectId, userId);
    res.status(200).json(project);
  } catch (error) {
    console.error('🚀 ~ getProjectController ~ error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
