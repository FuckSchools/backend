import { z } from 'zod';
import { threadEntity } from './thread.entity.js';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionEntity = z.object({
  id: z.uuidv4().nonempty(),
  threads: threadEntity.array().nullish(),
  owner: sessionOwnerEnum,
  createdAt: z.iso.datetime().nullish(),
  updatedAt: z.iso.datetime().nullish(),
});

export const sessionEntityWithoutId = sessionEntity.omit({ id: true });

export const sessionEntityForCreatingNewThread = z.object({
  id: z.uuidv4().nonempty(),
  thread: threadEntity.nullish(),
});
export const sessionEntityWithoutExternalEntities = sessionEntity.omit({
  threads: true,
});

export const sessionEntityWithNumberOfThreads =
  sessionEntityWithoutExternalEntities.extend({
    numberOfThreads: z.number().int().nonnegative(),
  });
