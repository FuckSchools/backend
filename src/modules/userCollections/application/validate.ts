import { UserEntity } from '../domain/entity/user.entity.js';
import type { IUserRepository } from '../domain/interface/repository.interface.js';
import { UserAuthService } from '../domain/service/user.service.js';

export const validateUser =
  (UserRepository: IUserRepository) =>
  async (clerkId: string): Promise<string> => {
    const userEntity = new UserEntity({ clerkId });
    const userAuthService = new UserAuthService(userEntity);
    const existingUserEntity = await UserRepository.getById(clerkId);
    if (existingUserEntity) {
      userAuthService.validateUser(existingUserEntity);
    } else {
      await UserRepository.save(userEntity);
      userAuthService.validateUser(userEntity);
    }
    return userAuthService.userId;
  };
