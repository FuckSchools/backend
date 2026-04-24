import { projectEntity } from '@/entities/project.entity.js';
import type z from 'zod';

export interface IProjectRepository {
  updateProject(
    id: z.infer<typeof projectEntity.shape.internal.shape.id>,
    title: z.infer<typeof projectEntity.shape.internal.shape.title>,
  ): Promise<z.infer<typeof projectEntity.shape.internal>>;

  getPartialSessionsForPreviewByPageAndId(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    page: number,
    pageSize: number,
  ): Promise<{
    sessions: z.infer<typeof projectEntity.shape.external.shape.sessions>;
  }>;

  getTreeIdById(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof projectEntity.shape.external.shape.tree>>;

  createNewSessionForProject(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    initialSession: z.infer<
      typeof projectEntity.shape.external.shape.sessions.element.shape.owner
    >,
  ): Promise<z.infer<typeof projectEntity.shape.external.shape.sessions>>;
}
