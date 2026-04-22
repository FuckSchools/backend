import { knownErrors } from '@/interfaces/error.js';

export const errorHandling = (error: unknown) => {
  if (knownErrors.some((KnownError) => error instanceof KnownError)) {
    console.error('🚀 ~ errorHandling ~ error:', error);
  }
  throw error;
};
