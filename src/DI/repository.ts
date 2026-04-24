import { z } from 'zod';
import { ProjectRepository } from '@/infrastructure/repository/project.infrastructure.js';
import { NodeRepository } from '@/infrastructure/repository/node.infrastructure.js';
import { SessionRepository } from '@/infrastructure/repository/session.infrastructure.js';
import { ThreadRepository } from '@/infrastructure/repository/thread.infrastructure.js';
import { TreeRepository } from '@/infrastructure/repository/tree.infrastructure.js';
import { UserRepository } from '@/infrastructure/repository/user.infrastructure.js';

export const dependencies = z.enum([
  'UserRepository',
  'ProjectRepository',
  'SessionRepository',
  'TreeRepository',
  'NodeRepository',
  'ThreadRepository',
]);

const repositoryMap = {
  UserRepository: new UserRepository(),
  ProjectRepository: new ProjectRepository(),
  SessionRepository: new SessionRepository(),
  TreeRepository: new TreeRepository(),
  NodeRepository: new NodeRepository(),
  ThreadRepository: new ThreadRepository(),
} as const;

export const getInjection = <T extends z.infer<typeof dependencies>>(
  dependency: T,
) => {
  return repositoryMap[dependency];
};
