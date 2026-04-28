import { z } from 'zod';

export const errorEnum = z.enum([
  'InfrastructureError',
  'ValidationError',
  'UseCaseError',
  'MiddlewareError',
  'IllegalOperationError',
  'UserIdNotFoundError',
  'UserAlreadyExistsError',
]);

export type ErrorEnum = z.infer<typeof errorEnum>;
