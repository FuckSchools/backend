import type { ThreadFull, Thread } from '../entity/thread.entity.js';

export interface IThreadRepository {
  createThread(sessionId: string, params: Thread): Promise<ThreadFull>;
  getThreadsBySessionId(sessionId: string): Promise<Array<ThreadFull>>;
  getThreadById(threadId: string): Promise<ThreadFull | null>;
}
