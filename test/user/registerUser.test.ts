import { registerUserUseCase } from '@/applications/user/registerUser.js';
import { getInjection } from '@/DI/repository.js';
import { randomInt, randomUUID } from 'node:crypto';
import { ZodError } from 'zod';

const register = registerUserUseCase(getInjection('UserRepository'));

it('register with valid id', async () => {
  const userId = `test-user-id-${randomUUID()}`;
  const result = await register(userId);
  expect(result, `Expected user ID to be ${userId}`).toBe(userId);
});

it('register with empty id', async () => {
  const userId = '';
  await expect(register(userId)).rejects.toThrow(ZodError);
});

it('register with empty id after trimming', async () => {
  const userId = ' '.repeat(randomInt(1, 100));
  await expect(register(userId)).rejects.toThrow(ZodError);
});

it('register with existing id', async () => {
  const userId = 'test-user-id';
  await expect(register(userId)).rejects.toThrow();
});

it('register with valid id with leading and trailing spaces', async () => {
  const userId =
    `  `.repeat(randomInt(50, 100)) +
    `test-user-id-${randomUUID()}` +
    `  `.repeat(randomInt(50, 100));
  const result = await register(userId);
  expect(result, `Expected user ID to be ${userId.trim()}`).toBe(userId.trim());
});

it('register with existing id with leading and trailing spaces', async () => {
  const userId = `   test-user-id   `;
  await expect(register(userId)).rejects.toThrow();
});

it('register with id with internal spaces', async () => {
  const userId = `test   user   id ${randomUUID()}`;
  const result = await register(userId);
  expect(result, `Expected user ID to be ${userId}`).toBe(userId);
});
