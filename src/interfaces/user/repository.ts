import type { UserEntity } from "../../entities/user.js";

export interface IUserRepository
{
  createUser( user: Pick<UserEntity, "id" | "authInfo" > ) : Promise<Partial<UserEntity>>;
  getUserById( id: string, include: Array<keyof Pick<UserEntity, "authInfo" | "projects">> ) : Promise<Partial<UserEntity> | null>;

}