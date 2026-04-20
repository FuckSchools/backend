import { z } from 'zod';

export const projectEntity = z.object({
  id: z.string().nonempty(),
  name: z.string().optional(),
  description: z.string().optional(),
  sandboxExId: z.string().optional(),
  sessions: z.array(z.any()).optional(),
});
