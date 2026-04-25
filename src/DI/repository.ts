import { z } from 'zod';
import { ProjectRepository } from '@/infrastructure/repository/project.infrastructure.js';
import { NodeRepository } from '@/infrastructure/repository/node.infrastructure.js';
import { SessionRepository } from '@/infrastructure/repository/session.infrastructure.js';
import { ThreadRepository } from '@/infrastructure/repository/thread.infrastructure.js';
import { TreeRepository } from '@/infrastructure/repository/tree.infrastructure.js';
import { UserRepository } from '@/infrastructure/repository/user.infrastructure.js';
import { MessageRepository } from '@/infrastructure/repository/message.infrastructure.js';
import { StateOfCompletionRepository } from '@/infrastructure/repository/soc.infrastructure.js';
import { PrerequisiteRepository } from '@/infrastructure/repository/prerequisite.infrastructure.js';

export const dependencies = z.enum([
  'UserRepository',
  'ProjectRepository',
  'SessionRepository',
  'TreeRepository',
  'NodeRepository',
  'ThreadRepository',
  'MessageRepository',
  'StateOfCompletionRepository',
  'PrerequisiteRepository',
]);

const repositoryMap = {
  UserRepository: new UserRepository(),
  ProjectRepository: new ProjectRepository(),
  SessionRepository: new SessionRepository(),
  TreeRepository: new TreeRepository(),
  NodeRepository: new NodeRepository(),
  ThreadRepository: new ThreadRepository(),
  MessageRepository: new MessageRepository(),
  StateOfCompletionRepository: new StateOfCompletionRepository(),
  PrerequisiteRepository: new PrerequisiteRepository(),
} as const;

export const getInjection = <T extends z.infer<typeof dependencies>>(
  dependency: T,
) => {
  return repositoryMap[dependency];
};
