import type { ProjectEntity } from "./project.js";

export type SessionEntity = {
  id: string;
  projectId: string;
  project: ProjectEntity;
  owner: SessionOwnerEntity;
  createdAt: Date;
};

const SessionOwnerEntity =
{
  CODING_AGENT: "CODING_AGENT",
  EXTERNAL_AGENT: "EXTERNAL_AGENT",
  BACKGROUND_AGENT: "BACKGROUND_AGENT",
} as const;

export type SessionOwnerEntity = typeof SessionOwnerEntity[keyof typeof SessionOwnerEntity];