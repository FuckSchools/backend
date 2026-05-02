import { z } from 'zod';
import { CustomError } from '@/shared/domain/interface/error.interface.js';

/**
 * GoalContext is a Value Object that captures the semantic context of a Node's
 * goal: what the agent is trying to achieve, how to know it succeeded, and
 * what constraints apply. It is immutable after construction and compared by
 * structural equality (not by identity).
 */
export const goalContextSchema = z.object({
  intentSummary: z.string().min(1),
  constraints: z.string().array(),
  successSignals: z.string().array().min(1),
  pathFromRoot: z.string().array(),
  rootNodeId: z.string().uuid(),
});

export type GoalContext = z.infer<typeof goalContextSchema>;

export const createGoalContext = (raw: unknown): GoalContext => {
  const result = goalContextSchema.safeParse(raw);
  if (!result.success) {
    throw new CustomError(
      `Invalid GoalContext: ${result.error.message}`,
      'ValidationError',
    );
  }
  return Object.freeze(result.data);
};
