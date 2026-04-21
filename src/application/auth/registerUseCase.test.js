/**
 * Tests para registerUseCase (SMAPP-13 / HU1).
 *
 * Criterios de aceptación:
 * - Llama a registerRequest con los datos recibidos
 * - Retorna el user del response exitoso
 * - Propaga el error si registerRequest falla
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../infrastructure/api/authApi.js', () => ({
  registerRequest: vi.fn(),
}));

const { registerRequest } = await import('../../infrastructure/api/authApi.js');
const { registerUseCase } = await import('./registerUseCase.js');

const mockUser = { id: 2, name: 'Carlos', email: 'carlos@test.com', role: 'student' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('registerUseCase', () => {
  it('llama a registerRequest con los datos recibidos', async () => {
    registerRequest.mockResolvedValue({ message: 'ok', user: mockUser });
    const data = { name: 'Carlos', email: 'carlos@test.com', password: '123', role: 'student' };

    await registerUseCase(data);

    expect(registerRequest).toHaveBeenCalledWith(data);
  });

  it('retorna el user del response exitoso', async () => {
    registerRequest.mockResolvedValue({ message: 'ok', user: mockUser });

    const result = await registerUseCase({ name: 'Carlos', email: 'carlos@test.com', password: '123', role: 'student' });

    expect(result).toEqual(mockUser);
  });

  it('propaga el error si registerRequest falla con 409', async () => {
    const error = Object.assign(new Error('Email ya registrado'), { response: { status: 409 } });
    registerRequest.mockRejectedValue(error);

    await expect(registerUseCase({ email: 'dup@test.com' })).rejects.toThrow('Email ya registrado');
  });

  it('propaga el error si registerRequest falla por red', async () => {
    registerRequest.mockRejectedValue(new Error('Network Error'));

    await expect(registerUseCase({})).rejects.toThrow('Network Error');
  });
});
