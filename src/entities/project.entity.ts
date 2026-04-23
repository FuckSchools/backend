import { z } from 'zod';
import { treeEntity } from './tree.entity.js';
import { sessionEntity } from './session.entity.js';

export const projectEntity = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().optional(),
  sandboxExId: z.string().optional(),
  tree: treeEntity.optional(),
  sessions: z.array(sessionEntity).default([]),

  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
});
