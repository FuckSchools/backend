import { registerUserUseCase } from '@/applications/user/registerUser.js';
import { userEntity } from '@/entities/user.entity.js';
import express from 'express';
import { getInjection } from '@/DI/repository.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import { findUserByIdUseCase } from '@/applications/user/findUserById.js';

const userRepository = getInjection('UserRepository');

export const registerUserController = async (
  _req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const existingUser = await findUserByIdUseCase(userRepository)(userId);
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    const result = await registerUserUseCase(userRepository)(userId);
    res.status(201).json({ userId: result });
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ registerUserController ~ error:', error);
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
