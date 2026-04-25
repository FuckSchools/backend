import { prisma } from '@/config/prisma.js';
import type { userEntity } from '@/entities/user.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IUserRepository } from '@/interfaces/repository/user.interface.js';
import type { output, ZodString, ZodObject, ZodDate } from 'zod';
import type { $strip } from 'zod/v4/core';

export class UserRepository implements IUserRepository {
  async getAllUserProjectsByUserId(
    userId: output<typeof userEntity.shape.internal.shape.id>,
  ): Promise<output<typeof userEntity>> {
    const projects = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        projects: true,
      },
    });
    if (!projects) {
      throw new CustomError(
        `User with ID ${userId} not found.`,
        'IllegalOperationError',
      );
    }
    return {
      internal: {
        id: projects.id,
        createdAt: projects.createdAt,
      },
      external: {
        projects: projects.projects,
      },
    };
  }
  async register(
    userId: output<ZodString>,
  ): Promise<output<ZodObject<{ id: ZodString; createdAt: ZodDate }, $strip>>> {
    try {
      await this.getById(userId);
    } catch (error) {
      if (
        error instanceof CustomError &&
        error.name === 'IllegalOperationError'
      ) {
        // User not found, proceed to create a new one
        return await prisma.user.create({ data: { id: userId } });
      } else {
        // Other errors, rethrow
        throw error;
      }
    }
    throw new CustomError(
      `User with ID ${userId} already exists.`,
      'IllegalOperationError',
    );
  }
  async getById(
    userId: output<ZodString>,
  ): Promise<output<ZodObject<{ id: ZodString; createdAt: ZodDate }, $strip>>> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError(
        `User with ID ${userId} not found.`,
        'IllegalOperationError',
      );
    }
    return user;
  }
  async getPartialProjectsForPreviewByUserIdAndPage(
    userId: output<ZodString>,
    page: number,
    pageSize: number,
  ): Promise<output<typeof userEntity>> {
    const userWithProjects = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        projects: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        },
      },
    });
    if (!userWithProjects) {
      throw new CustomError(
        `User with ID ${userId} not found.`,
        'IllegalOperationError',
      );
    }
    return {
      external: { projects: userWithProjects.projects },
      internal: {
        id: userWithProjects.id,
        createdAt: userWithProjects.createdAt,
      },
    };
  }
}
