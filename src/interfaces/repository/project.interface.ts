import {
  projectEntity,
  type projectEntityForCreatingNewSession,
  type projectEntityWithoutExternalEntities,
  type projectEntityWithPreviewSessions,
} from '@/entities/project.entity.js';
import type z from 'zod';

export interface IProjectRepository {
  updateProject(
    project: z.infer<typeof projectEntityWithoutExternalEntities>,
  ): Promise<z.infer<typeof projectEntityWithoutExternalEntities>>;

  getPartialSessionsForPreviewByPageAndId(
    projectId: z.infer<typeof projectEntity.shape.id>,
    page: number,
    pageSize: number,
  ): Promise<{
    sessions: z.infer<typeof projectEntityWithPreviewSessions>;
    total: number;
  }>;

  getTreeById(
    projectId: z.infer<typeof projectEntity.shape.id>,
  ): Promise<z.infer<typeof projectEntity.shape.tree> | undefined>; // TODO: Start here ...

  createNewSessionForProject(
    projectId: z.infer<typeof projectEntityForCreatingNewSession>,
  ): Promise<z.infer<typeof projectEntity.shape.sessions>>;
}
