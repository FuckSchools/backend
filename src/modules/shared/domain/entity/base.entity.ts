import {
  messageEntity,
  messageProviderEntity,
} from '@/message/domain/entity/message.entity.js';
import {
  nodeEntity,
  nodeProviderEntity,
  rootNodeEntity,
  rootNodeProviderEntity,
} from '@/node/domain/entity/node.entity.js';
import {
  nodeContextEntity,
  nodeContextProviderEntity,
} from '@/node/domain/entity/nodeContext.entity.js';
import {
  projectEntity,
  projectProviderEntity,
} from '@/project/domain/entity/project.entity.js';
import {
  sessionEntity,
  sessionProviderEntity,
} from '@/session/domain/entity/session.entity.js';
import {
  threadEntity,
  threadProviderEntity,
} from '@/thread/domain/entity/thread.entity.js';
import {
  userEntity,
  userProviderEntity,
} from '@/user/domain/entity/user.entity.js';
import * as z from 'zod';

export const providerEntity = z.object({
  id: z.uuidv4(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export const entityName = {
  user: 'user',
  project: 'project',
  session: 'session',
  thread: 'thread',
  message: 'message',
  node: 'node',
  rootNode: 'rootNode',
  nodeContext: 'nodeContext',
} as const;
export type EntityName = (typeof entityName)[keyof typeof entityName];

export const allEntities: Record<EntityName, object> = {
  user: {
    entity: userEntity,
    providerEntity: userProviderEntity,
  },
  project: {
    entity: projectEntity,
    providerEntity: projectProviderEntity,
  },
  session: {
    entity: sessionEntity,
    providerEntity: sessionProviderEntity,
  },
  thread: {
    entity: threadEntity,
    providerEntity: threadProviderEntity,
  },
  message: {
    entity: messageEntity,
    providerEntity: messageProviderEntity,
  },
  rootNode: {
    entity: rootNodeEntity,
    providerEntity: rootNodeProviderEntity,
  },
  node: {
    entity: nodeEntity,
    providerEntity: nodeProviderEntity,
  },
  nodeContext: {
    entity: nodeContextEntity,
    providerEntity: nodeContextProviderEntity,
  },
};

export const relationsOfAllEntities: Record<
  EntityName,
  Record<string, { relation: EntityName; isArray: boolean }>
> = {
  user: {
    projects: { relation: 'project', isArray: true },
  },
  project: {
    sessions: { relation: 'session', isArray: true },
    rootNode: { relation: 'rootNode', isArray: false },
  },
  session: {
    threads: { relation: 'thread', isArray: true },
    project: { relation: 'project', isArray: false },
  },
  thread: {
    messages: { relation: 'message', isArray: true },
    session: { relation: 'session', isArray: false },
  },
  message: {
    thread: { relation: 'thread', isArray: false },
  },
  node: {
    parentNode: { relation: 'node', isArray: false },
    childNodes: { relation: 'node', isArray: true },
    nodeContext: { relation: 'nodeContext', isArray: false },
  },
  rootNode: {
    project: { relation: 'project', isArray: false },
    childNodes: { relation: 'node', isArray: true },
  },
  nodeContext: {
    node: { relation: 'node', isArray: false },
  },
};
