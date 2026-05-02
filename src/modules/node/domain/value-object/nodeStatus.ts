import { z } from 'zod';
import { CustomError } from '@/shared/domain/interface/error.interface.js';

export const nodeStatusSchema = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
]);

export type NodeStatus = z.infer<typeof nodeStatusSchema>;

const allowedTransitions: Record<NodeStatus, readonly NodeStatus[]> = {
  NOT_STARTED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED', 'FAILED'],
  COMPLETED: [],
  FAILED: ['IN_PROGRESS'],
};

export const canTransitionStatus = (
  from: NodeStatus,
  to: NodeStatus,
): boolean => {
  return (allowedTransitions[from] as readonly NodeStatus[]).includes(to);
};

export const assertStatusTransition = (
  from: NodeStatus,
  to: NodeStatus,
): void => {
  if (!canTransitionStatus(from, to)) {
    throw new CustomError(
      `Invalid status transition: ${from} → ${to}`,
      'IllegalOperationError',
    );
  }
};
