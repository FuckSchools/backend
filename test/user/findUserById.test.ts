import { findUserByIdUseCase } from '@/applications/user/findUserById.js';
import { registerUserUseCase } from '@/applications/user/registerUser.js';
import { getInjection } from '@/DI/repository.js';
import { prisma } from '@/config/prisma.js';
import { randomInt, randomUUID } from 'node:crypto';

const userRepository = getInjection('UserRepository');

beforeAll(async () => {
  await prisma.user.deleteMany();
});

it('find by an existing id', async () => {
  const userId = `test-user-id-${randomUUID()}`;
  expect(await registerUserUseCase(userRepository)(userId)).contain({
    id: userId,
  });
  expect(await findUserByIdUseCase(userRepository)(userId)).toBe(userId);
});

it('find by a non-existing id', async () => {
  const userId = `non-existing-user-id-${randomUUID()}`;
  await expect(findUserByIdUseCase(userRepository)(userId)).rejects.toThrow();
});

it('find by an empty id', async () => {
  const userId = '';
  await expect(findUserByIdUseCase(userRepository)(userId)).rejects.toThrow();
});

it('find by an empty id after trimming', async () => {
  const userId = '      ';
  await expect(findUserByIdUseCase(userRepository)(userId)).rejects.toThrow();
});

it.skip('find by an id with leading and trailing spaces', async () => {
  const userId =
    `  `.repeat(randomInt(50, 100)) +
    `test-user-id-${randomUUID()}` +
    `  `.repeat(randomInt(50, 100));
  expect(await registerUserUseCase(userRepository)(userId)).containSubset({
    id: userId.trim(),
  });
  expect(await findUserByIdUseCase(userRepository)(userId)).containSubset({
    id: userId.trim(),
  });
});

it.skip('find by an id with internal spaces', async () => {
  const userId = `test   user   id ${randomUUID()}`;
  expect(await registerUserUseCase(userRepository)(userId)).containSubset({
    id: userId,
  });
  expect(await findUserByIdUseCase(userRepository)(userId)).containSubset({
    id: userId,
  });
});
