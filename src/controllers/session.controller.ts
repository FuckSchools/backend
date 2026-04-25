import { createSessionUseCase } from '@/applications/session/createSession.js';
import { createThreadUseCase } from '@/applications/thread/createThread.js';
import { getSessionUseCase } from '@/applications/session/getSession.js';
import { getInjection } from '@/DI/repository.js';
import { sessionEntity } from '@/entities/session.entity.js';
import express from 'express';

const sessionRepository = getInjection('SessionRepository');
const threadRepository = getInjection('ThreadRepository');

export const createSessionController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const projectId =
      await sessionEntity.shape.external.shape.projectId.parseAsync(
        req.body['projectId'],
      );
    const owner = await sessionEntity.shape.internal.shape.owner.parseAsync(
      req.body['owner'],
    );

    const createdSession = await createSessionUseCase(sessionRepository)({
      projectId,
      owner,
    });

    res.status(201).json(createdSession);
  } catch (error) {
    console.error('🚀 ~ createSessionController ~ error:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSessionController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const sessionId = await sessionEntity.shape.internal.shape.id.parseAsync(
      req.params['sessionId'],
    );

    const session = await getSessionUseCase(sessionRepository)({ sessionId });

    res.status(200).json(session);
  } catch (error) {
    console.error('🚀 ~ getSessionController ~ error:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createThreadController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const sessionId = await sessionEntity.shape.internal.shape.id.parseAsync(
      req.params['sessionId'],
    );

    const thread = await createThreadUseCase(threadRepository)({ sessionId });

    res.status(201).json(thread);
  } catch (error) {
    console.error('🚀 ~ createThreadController ~ error:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
};
