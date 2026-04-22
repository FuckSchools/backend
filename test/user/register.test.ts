import { registerUserUseCase } from '@/applications/user/register.js';
import { getInjection } from '@/DI/repository.js';

const register = registerUserUseCase(getInjection('UserRepository'));

it('register with valid id', async () => {
  const userId = `test-user-id-${Date.now()}`;
  const result = await register(userId);
  expect(result).toBe(userId);
});

it('register with empty id', async () => {
  const userId = '';
  await expect(register(userId)).rejects.toThrow();
});

it('register with empty id after trimming', async () => {
  const userId = '      ';
  await expect(register(userId)).rejects.toThrow();
});

it('register with existing id', async () => {
  const userId = 'test-user-id';
  await expect(register(userId)).rejects.toThrow();
});
