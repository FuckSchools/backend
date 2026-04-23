import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type { output, ZodString } from 'zod';
import { prisma } from '@/config/prisma.js';
import { knownErrors } from '@/interfaces/error.interface.js';

export class UserRepository implements IUserRepository {
  async getById(
    userId: output<ZodString>,
  ): Promise<output<ZodString> | undefined> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      return existingUser?.id;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ UserRepository.getById ~ error:', error);
      }
      throw error;
    }
  }
  async register(userId: output<ZodString>): Promise<output<ZodString>> {
    try {
      const user = await prisma.user.create({
        data: {
          id: userId,
        },
      });
      return user.id;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ UserRepository.register ~ error:', error);
      }
      throw error;
    }
  }
}
