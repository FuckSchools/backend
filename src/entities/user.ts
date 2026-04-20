import type { ProjectEntity } from "./project.js";

export type UserEntity = {
  id: string;
  authInfo?: authInfo;
  projects?: ProjectEntity[];
  memories?: MemoryEntity[];
  createdAt?: Date;
};

export type authInfo = {
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type MemoryEntity = {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
};
