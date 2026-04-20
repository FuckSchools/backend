import type { SessionEntity } from "./session.js";
import type { UserEntity } from "./user.js";

export type ProjectEntity = {
  id: string;
  name: string;
  description: string;
  sandboxExId: string;
  userId: string;
  user: UserEntity;
  sessions?: SessionEntity[];
  createdAt: Date;
};