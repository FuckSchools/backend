import type { IRootNodeRepository } from '@/node/domain/interface/node.interface.js';
import { RootNodeRepository } from '@/node/infrastructure/repository/node.repository.js';
import type { ISessionRepository } from '@/session/domain/interface/session.interface.js';
import { SessionRepository } from '@/session/infrastructure/repository/session.repository.js';
import type { IUserRepository } from '@/user/domain/interface/user.interface.js';
import { UserRepository } from '@/user/infrastructure/repository/user.repository.js';
import type { IProjectRepository } from '@/project/domain/interface/project.interface.js';
import { ProjectRepository } from '@/project/infrastructure/repository/project.repository.js';

const prismaRepository: RepositoryInjectionType = {
  rootNodeRepository: new RootNodeRepository(),
  userRepository: new UserRepository(),
  projectRepository: new ProjectRepository(),
  sessionRepository: new SessionRepository(),
};

export const repositoryInjection = {
  prisma: prismaRepository,
};

export type RepositoryInjectionType = {
  rootNodeRepository: IRootNodeRepository;
  userRepository: IUserRepository;
  projectRepository: IProjectRepository;
  sessionRepository: ISessionRepository;
};
