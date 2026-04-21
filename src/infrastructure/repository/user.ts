import type { IUserRepository } from '@/interfaces/repository/user.js';
import type { output, ZodString } from 'zod';
import { prisma } from '@/config/prisma.js';

export class UserRepository implements IUserRepository {
  async register(userId: output<ZodString>): Promise<output<ZodString>> {
    try {
      const user = await prisma.user.create({
        data: {
          id: userId,
        },
      });
      if (!user) {
        console.error(`Failed to create user with id ${userId}`);
        throw new Error('Failed to create user');
      }
      return user.id;
    } catch (error) {
      console.error(`Error occurred while creating user with id ${userId}`);
      throw error;
    }
  }
}
