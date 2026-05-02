import { z } from 'zod';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionSchema = z.object({
  owner: sessionOwnerEnum,
});

export type Session = z.infer<typeof sessionSchema>;