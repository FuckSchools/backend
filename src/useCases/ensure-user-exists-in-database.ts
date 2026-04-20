import type { UserEntity } from "../entities/user.js";
import type { IUseCase } from "../interfaces/use-case.js";
import type { IUserRepository } from "../interfaces/user/repository.js";

export class EnsureUserExistsInDatabase implements IUseCase<UserEntity>
{
  private userRepository: IUserRepository;
  constructor ( userRepository: IUserRepository )
  {
    this.userRepository = userRepository;
  }

  async call( userId: UserEntity["id"] ): Promise<UserEntity>
  {
    const existingUser = await this.userRepository.getUserById( userId );
    if ( !existingUser )
    {
      console.error( `User with ID ${userId} not found in database. Creating new user.` );
      throw new Error( `User with ID ${userId} not found in database.` );
    }
    return existingUser;
  }
}