import { findUserByIdUseCase } from '@/applications/user/findUserById.js';
import { registerUserUseCase } from '@/applications/user/registerUser.js';
import { getInjection } from '@/DI/repository.js';
import { randomInt, randomUUID } from 'node:crypto';
import { ZodError } from 'zod';

const userRepository = getInjection('UserRepository');

it('find by an existing id', async () => {
  const userId = `test-user-id-${randomUUID()}`;
  expect(await registerUserUseCase(userRepository)(userId)).toBe(userId);
  expect(await findUserByIdUseCase(userRepository)(userId)).toBe(userId);
});

it('find by a non-existing id', async () => {
  const userId = `non-existing-user-id-${randomUUID()}`;
  expect(await findUserByIdUseCase(userRepository)(userId)).toBeUndefined();
});

it('find by an empty id', async () => {
  const userId = '';
  await expect(findUserByIdUseCase(userRepository)(userId)).rejects.toThrow(
    ZodError,
  );
});

it('find by an empty id after trimming', async () => {
  const userId = '      ';
  await expect(findUserByIdUseCase(userRepository)(userId)).rejects.toThrow(
    ZodError,
  );
});

it('find by an id with leading and trailing spaces', async () => {
  const userId =
    `  `.repeat(randomInt(50, 100)) +
    `test-user-id-${randomUUID()}` +
    `  `.repeat(randomInt(50, 100));
  expect(await registerUserUseCase(userRepository)(userId)).toBe(userId.trim());
  expect(await findUserByIdUseCase(userRepository)(userId)).toBe(userId.trim());
});

it('find by an id with internal spaces', async () => {
  const userId = `test   user   id ${randomUUID()}`;
  expect(await registerUserUseCase(userRepository)(userId)).toBe(userId);
  expect(await findUserByIdUseCase(userRepository)(userId)).toBe(userId);
});
