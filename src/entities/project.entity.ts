import { z } from 'zod';
import { treeEntity } from './tree.entity.js';
import { sessionEntity, sessionEntityWithoutId } from './session.entity.js';

export const projectEntity = z.object({
  id: z.uuidv4().nonempty(),
  title: z.string().default('Untitled Project'),
  description: z.string().nullish(),
  sandboxExId: z.string().nullish(),
  tree: treeEntity.nullish(),
  sessions: z.array(sessionEntity).nullish(),

  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
} );


export const projectEntityWithoutId = projectEntity.omit( { id: true } );

export const projectEntityWithoutTreeAndSessions = projectEntity.omit( {
  tree: true,
  sessions: true,
} );

export const projectEntityForCreatingNewSession = z.object( {
  id: z.uuidv4().nonempty(),
  session: sessionEntityWithoutId.nonoptional(),
})