import { z } from 'zod';

const messageSenderEnum = z.enum(['HUMAN', 'SYSTEM', 'AI', 'TOOL']);

export const messageEntity = z.object({
  id: z.uuidv4().nonempty(),
  sender: messageSenderEnum,
  content: z.string().nonempty(),
  createdAt: z.iso.datetime().nullish(),
});

export const threadEntity = z.object({
  id: z.uuidv4().nonempty(),
  messages: z.array(messageEntity).nullish(),
  createdAt: z.iso.datetime().nullish(),
});

export const messageCreationInputEntity = z.object( {
  sender: messageSenderEnum,
  content: z.string().nonempty()
} );

export const messageCreationOutputEntity = z.object({
  id: z.uuidv4().nonempty(),
  sender: messageSenderEnum,
  content: z.string().nonempty(),
  createdAt: z.iso.datetime().nullish(),
} );
