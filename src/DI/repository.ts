import { z } from 'zod';
import { UserRepository } from '@/infrastructure/repository/user.infrastructure.js';

export const dependencies = z.enum(['UserRepository']);

const repositoryMap = {
  UserRepository: new UserRepository(),
};
export const getInjection = (dependency: z.infer<typeof dependencies>) => {
  return repositoryMap[dependency];
};
