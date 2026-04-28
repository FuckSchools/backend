import { BaseService } from '@/modules/shared/domain/service/base.service.js';
import type { IUserRepository } from '../interface/user.interface.js';
import {
  userEntity,
  userProviderEntity,
  type User,
  type UserProvider,
} from '../entity/user.entity.js';

export class UserService extends BaseService<User, UserProvider> {
  private clerkId: string;
  constructor(repository: IUserRepository, clerkId: string) {
    super(repository, userEntity.extend(userProviderEntity.shape));
    this.clerkId = clerkId;
  }
  public async validateWithClerkId() {
    const user = await this.repository.getById(this.clerkId);
    if (!user) {
      return await this.create({ clerkId: this.clerkId });
    }
    return user;
  }
}
