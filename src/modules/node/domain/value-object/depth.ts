import { z } from 'zod';
import { CustomError } from '@/shared/domain/interface/error.interface.js';

/** Depth is a non-negative integer representing a node's level in the tree. */
export const depthSchema = z.number().int().nonnegative();

export type Depth = z.infer<typeof depthSchema>;

export const createDepth = (value: number): Depth => {
  const result = depthSchema.safeParse(value);
  if (!result.success) {
    throw new CustomError(
      `Depth must be a non-negative integer, got: ${value}`,
      'ValidationError',
    );
  }
  return result.data;
};
