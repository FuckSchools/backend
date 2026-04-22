import { registerUserUseCase } from '@/applications/user/register.js';
import { userEntity } from '@/entities/user.js';
import express from 'express';
import { getInjection } from '@/DI/repository.js';
import { errorHandling } from '@/config/error-handling.js';

export const registerUserController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.id.parseAsync(req.body.userId);
    const result = await registerUserUseCase(getInjection('UserRepository'))(
      userId,
    );
    res.status(201).json({ userId: result });
  } catch (error) {
    errorHandling(error);
  }
};
