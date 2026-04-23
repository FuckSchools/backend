import { z } from 'zod';
import { threadEntity } from './thread.entity.js';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionEntity = z.object({
  id: z.uuidv4().nonempty(),
  threads: threadEntity.array().default([]),
  owner: sessionOwnerEnum,
  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
});
