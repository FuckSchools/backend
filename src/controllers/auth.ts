import { registerUserUseCase } from '@/applications/user/register.js';
import { userEntity } from '@/entities/user.js';
import express from 'express';
import { getInjection } from '@/DI/repository.js';

export const registerUserController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    console.info(req);
    const userId = await userEntity.shape.id.parseAsync(req.body.userId);
    const result = await registerUserUseCase(getInjection('UserRepository'))(
      userId,
    );
    if (result) {
      res.status(200).json({ message: 'User registered successfully' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
      console.error('Error to register user');
      return;
    }
  } catch (error) {
    console.error('Error occurred while parsing userId:', error);
    res.status(400).json({ error: 'Invalid userId format' });
    return;
  }
};
