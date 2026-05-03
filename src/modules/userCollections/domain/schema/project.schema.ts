import z from 'zod';

export const projectSchema = z.object({
  title: z.string().nonempty(),
  userId: z.uuidv4(),
});
