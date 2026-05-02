import type { IRepository } from "@/shared/domain/interface/repository.interface.js";
import type { SessionEntity } from "../entity/session.entity.js";
import type { ThreadEntity } from "../entity/thread.entity.js";
import type { MessageEntity } from "../entity/message.entity.js";

export interface ISessionRepository extends IRepository<SessionEntity>
{
  getByProjectId ( projectId: string ): Promise<SessionEntity[]>;
  getThreadsBySessionEntity ( sessionEntity: SessionEntity ): Promise<ThreadEntity[]>;
  createThreadInSession ( sessionEntity: SessionEntity, threadEntity: ThreadEntity ): Promise<void>
  getMessagesByThreadEntity ( threadEntity: ThreadEntity ): Promise<MessageEntity[]>;
  createMessageInThread ( threadEntity: ThreadEntity, messageEntity: MessageEntity ): Promise<void>
}