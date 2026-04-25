import { registerUserUseCase } from '@/applications/user/registerUser.js';
import { userEntity } from '@/entities/user.entity.js';
import express from 'express';
import { getInjection } from '@/DI/repository.js';
import { CustomError } from '@/interfaces/error.interface.js';

const userRepository = getInjection('UserRepository');

export const registerUserController = async (
  _req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const result = await registerUserUseCase(userRepository)({ userId });
    res.status(201).json({ userId: result });
  } catch (error) {
    if (
      error instanceof CustomError &&
      error.name === 'UserAlreadyExistsError'
    ) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    console.error('🚀 ~ registerUserController ~ error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
