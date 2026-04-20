import { z } from 'zod';
import { threadEntity } from './thread.js';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionEntity = z.object({
  id: z.string().nonempty(),
  threads: threadEntity.array().optional().default([]),
  owner: sessionOwnerEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});
