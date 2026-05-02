import type { IRootNodeRepository } from '@/node/domain/interface/node.interface.js';
import { RootNodeRepository } from '@/node/infrastructure/repository/node.repository.js';
import type { ISessionRepository } from '@/session/domain/interface/session.interface.js';
import { SessionRepository } from '@/session/infrastructure/repository/session.repository.js';
import type { IUserRepository } from '@/userCollections/domain/interface/repository.interface.js';
import { UserRepository } from '@/userCollections/infrastructure/repository/user.repository.js';

const prismaRepository: RepositoryInjectionType = {
  rootNodeRepository: new RootNodeRepository(),
  userRepository: new UserRepository(),
  sessionRepository: new SessionRepository(),
};

export const repositoryInjection = {
  prisma: prismaRepository,
};

export type RepositoryInjectionType = {
  rootNodeRepository: IRootNodeRepository;
  userRepository: IUserRepository;
  sessionRepository: ISessionRepository;
};
