import { createMessageUseCase } from '@/applications/message/createMessage.js';
import { messageEntity } from '@/entities/message.entity.js';
import type express from 'express';
import { messageRepository } from './thread.controller.js';

export const createMessageController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const threadId = await messageEntity.shape.internal.shape.id.parseAsync(
      req.params['threadId'],
    );
    const role = await messageEntity.shape.internal.shape.role.parseAsync(
      req.body['role'],
    );
    const content = await messageEntity.shape.internal.shape.content.parseAsync(
      req.body['content'],
    );

    const message = await createMessageUseCase(messageRepository)({
      threadId,
      role,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('🚀 ~ createMessageController ~ error:', error);

    res.status(500).json(error);
  }
};
