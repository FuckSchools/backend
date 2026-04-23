import { z } from 'zod';

const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageEntity = z.object({
  id: z.uuid().nonempty(),
  sender: messageSenderEnum,
  content: z.string().nonempty(),
  createdAt: z.iso.datetime().nullish(),
});

export const threadEntity = z.object({
  id: z.uuid().nonempty(),
  messages: z.array(messageEntity).default([]),
  createdAt: z.iso.datetime().nullish(),
});
