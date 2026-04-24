import { createMessageUseCase } from '@/applications/thread/createMessage.js';
import { getThreadUseCase } from '@/applications/thread/getThread.js';
import { getInjection } from '@/DI/repository.js';
import { threadEntity } from '@/entities/thread.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import express from 'express';

const threadRepository = getInjection('ThreadRepository');

export const getThreadController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const threadId = await threadEntity.shape.internal.shape.id.parseAsync(
      req.params['threadId'],
    );

    const thread = await getThreadUseCase(threadRepository)(threadId, userId);

    res.status(200).json(thread);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ getThreadController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createMessageController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const threadId = await threadEntity.shape.internal.shape.id.parseAsync(
      req.params['threadId'],
    );
    const sender =
      await threadEntity.shape.external.shape.messages.element.shape.sender.parseAsync(
        req.body['sender'],
      );
    const content =
      await threadEntity.shape.external.shape.messages.element.shape.content.parseAsync(
        req.body['content'],
      );

    const messages = await createMessageUseCase(threadRepository)(
      threadId,
      userId,
      sender,
      content,
    );

    res.status(201).json(messages);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ createMessageController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
