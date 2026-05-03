import { z } from 'zod';

const sessionOwnerEnum = z.enum([
  'CODING_AGENT',
  'EXTERNAL_AGENT',
  'BACKGROUND_AGENT',
]);

export const sessionSchema = z.object({
  owner: sessionOwnerEnum,
  projectId: z.uuidv4(),
});

export type Session = z.infer<typeof sessionSchema>;
