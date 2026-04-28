import type { User, UserProvider } from '../entity/user.entity.js';
import type { IRepository } from '@/shared/domain/interface/repository.interface.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserRepository extends IRepository<User, UserProvider> {}
