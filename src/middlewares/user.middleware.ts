import { findUserByIdUseCase } from '@/applications/user/findUserById.js';
import { getInjection } from '@/DI/repository.js';
import { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import express from 'express';
import * as z from 'zod';
const userRepository = getInjection('UserRepository');

export const userMiddleware = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const validatedUserId = await findUserByIdUseCase(userRepository)({
      userId,
    });
    res.locals['userId'] = validatedUserId;
    next();
  } catch (error) {
    if (error instanceof CustomError && error.name === 'UserNotFoundError') {
      res.status(404).json({ error: 'User not found' });
    } else if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid user ID format', details: error });
    } else {
      console.error('🚀 ~ userMiddleware ~ error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
