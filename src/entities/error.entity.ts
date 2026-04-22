import z from 'zod';

export const errorEnum = z.enum([
  'InfrastructureError',
  'ValidationError',
  'UseCaseError',
  'MiddlewareError',
]);
