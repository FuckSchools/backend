import { projectEntity, type projectEntityForCreatingNewSession, type projectEntityWithoutTreeAndSessions } from '@/entities/project.entity.js';
import type z from 'zod';



export interface IProjectRepository
{

  updateProject ( project: z.infer<typeof projectEntityWithoutTreeAndSessions> ): Promise<z.infer<typeof projectEntity>>;

  getPartialSessionsForPreviewByPageAndId(
    projectId: z.infer<typeof projectEntity.shape.id>,
    page: number,
    pageSize: number,
  ): Promise<{ sessions: z.infer<typeof projectEntity.shape.sessions>; total: number; }>;

  getTreeById ( projectId: z.infer<typeof projectEntity.shape.id> ): Promise<z.infer<typeof projectEntity.shape.tree> | undefined>;

  createNewSessionForProject ( projectId: z.infer<typeof projectEntityForCreatingNewSession> ): Promise<z.infer<typeof projectEntity.shape.sessions>>;
}
