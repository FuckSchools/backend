import { prisma } from "../adapters/prisma.js";
import type { IUserRepository } from "../interfaces/user/repository.js";
import type { UserEntity } from "../entities/user.js";

export class UserRepository implements IUserRepository
{
  async createUser ( user: Pick<UserEntity, "id" > ) : Promise<Partial<UserEntity>>
  {
    const createdUser = await prisma.user.create( {
      data: user
    } );
    return createdUser;
  }
  async getUserById ( id: string, include: Array<keyof Pick<UserEntity, "authInfo" | "projects">> ) : Promise<Partial<UserEntity>>
  {
    const user = await prisma.user.findUnique( {
      where: { id },
      include: include.reduce( ( acc, key ) => {
        if ( key === "authInfo" )
        {
          acc.authInfo = true;
        }
        if ( key === "projects" )
        {
          acc.projects = true;
        }
        return acc;
      }, {} as Record<string, boolean> )
    } );
    typeof include
    return user ?? {};
  }
}