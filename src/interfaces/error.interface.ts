import type { errorEnum } from '@/entities/error.entity.js';
import type { z } from 'zod';
import { ZodError } from 'zod';

export class CustomError<T extends z.infer<typeof errorEnum>> extends Error {
  constructor(message: string, type: T) {
    super(message);
    this.name = type;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const knownErrors = [CustomError, ZodError];
