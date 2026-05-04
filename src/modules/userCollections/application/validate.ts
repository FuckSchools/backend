import { UserEntity } from '../domain/entity/user.entity.js';
import type { IUserRepository } from '../domain/interface/repository.interface.js';
import { UserAuthService } from '../domain/service/user.service.js';
import { err, ok, type ResultAsync } from 'neverthrow';

export const validateUser =
  (userRepository: IUserRepository) =>
  async (clerkId: string): Promise<ResultAsync<string, string>> => {
    const userEntity = new UserEntity({ clerkId });
    const userAuthService = new UserAuthService(userEntity);
    const existingUserResult = await userRepository.getById(clerkId);

    if (existingUserResult.isErr()) {
      return err(existingUserResult.error);
    }
    const existingUserEntity = existingUserResult.value;
    if (!existingUserEntity) {
      return err('User not found');
    }
    userAuthService.validateUser(existingUserEntity);
    return ok(userAuthService.userId);
  };
