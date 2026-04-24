import { createSessionUseCase } from '@/applications/session/createSession.js';
import { createThreadUseCase } from '@/applications/session/createThread.js';
import { getSessionUseCase } from '@/applications/session/getSession.js';
import { getInjection } from '@/DI/repository.js';
import { projectEntity } from '@/entities/project.entity.js';
import { sessionEntity } from '@/entities/session.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import express from 'express';

const sessionRepository = getInjection('SessionRepository');

export const createSessionController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const projectId = await projectEntity.shape.internal.shape.id.parseAsync(
      req.body['projectId'],
    );
    const owner = await sessionEntity.shape.internal.shape.owner.parseAsync(
      req.body['owner'],
    );

    const createdSession = await createSessionUseCase(sessionRepository)(
      projectId,
      userId,
      owner,
    );

    res.status(201).json(createdSession);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ createSessionController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSessionController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const sessionId = await sessionEntity.shape.internal.shape.id.parseAsync(
      req.params['sessionId'],
    );

    const session = await getSessionUseCase(sessionRepository)(
      sessionId,
      userId,
    );

    res.status(200).json(session);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ getSessionController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createThreadController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const sessionId = await sessionEntity.shape.internal.shape.id.parseAsync(
      req.params['sessionId'],
    );

    const threads = await createThreadUseCase(sessionRepository)(
      sessionId,
      userId,
    );

    res.status(201).json(threads);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ createThreadController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
