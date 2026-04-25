import { getThreadUseCase } from '@/applications/thread/getThread.js';
import { getInjection } from '@/DI/repository.js';
import { threadEntity } from '@/entities/thread.entity.js';
import express from 'express';

const threadRepository = getInjection('ThreadRepository');
export const messageRepository = getInjection('MessageRepository');

export const getThreadController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const threadId = await threadEntity.shape.internal.shape.id.parseAsync(
      req.params['threadId'],
    );

    const thread = await getThreadUseCase(threadRepository)({ threadId });

    res.status(200).json(thread);
  } catch (error) {
    console.error('🚀 ~ getThreadController ~ error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
