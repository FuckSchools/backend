import { UserEntity } from '../domain/entity/user.entity.js';
import type { IUserRepository } from '../domain/interface/repository.interface.js';
import { UserAuthService } from '../domain/service/user.service.js';

export const validateUser =
  (UserRepository: IUserRepository) =>
  async (clerkId: string): Promise<string> => {
    const userEntity = new UserEntity({ clerkId });
    const userAuthService = new UserAuthService(userEntity, UserRepository);
    await userAuthService.validateUser();
    if (!userAuthService.isValidated) {
      await userAuthService.registerUser();
    }
    return userAuthService.userId;
  };
