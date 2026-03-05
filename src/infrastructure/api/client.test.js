/**
 * Tests para el cliente HTTP central basado en Axios (SMAPP-9).
 *
 * Criterios de aceptación:
 * - baseURL construida desde variable de entorno VITE_API_URL
 * - withCredentials: true en cada petición
 * - 401 fuera de /login redirige a /login
 * - 401 en /login NO redirige (evita recarga de página)
 * - Errores HTTP distintos de 401 se rechazan normalmente
 * - get, post y put devuelven response.data directamente
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

let errorInterceptor;

const mockInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn((onSuccess, onError) => {
        errorInterceptor = onError;
      }),
    },
  },
};

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockInstance),
  },
}));

const { get, post, put } = await import('./client.js');

beforeEach(() => {
  mockInstance.get.mockReset();
  mockInstance.post.mockReset();
  mockInstance.put.mockReset();
  delete window.location;
  window.location = { pathname: '/', href: '' };
});

describe('axios.create', () => {
  it('se llama con baseURL desde VITE_API_URL y withCredentials true', () => {
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        withCredentials: true,
      }),
    );
  });
});

describe('get', () => {
  it('llama a instance.get con el endpoint y devuelve data', async () => {
    const payload = { id: 1 };
    mockInstance.get.mockResolvedValue({ data: payload });

    const result = await get('/users/1');

    expect(mockInstance.get).toHaveBeenCalledWith('/users/1', {});
    expect(result).toEqual(payload);
  });
});

describe('post', () => {
  it('llama a instance.post con endpoint y body, devuelve data', async () => {
    const body = { name: 'Ana' };
    const payload = { id: 2, name: 'Ana' };
    mockInstance.post.mockResolvedValue({ data: payload });

    const result = await post('/users', body);

    expect(mockInstance.post).toHaveBeenCalledWith('/users', body, {});
    expect(result).toEqual(payload);
  });
});

describe('put', () => {
  it('llama a instance.put con endpoint y body, devuelve data', async () => {
    const body = { name: 'Bob' };
    const payload = { id: 1, name: 'Bob' };
    mockInstance.put.mockResolvedValue({ data: payload });

    const result = await put('/users/1', body);

    expect(mockInstance.put).toHaveBeenCalledWith('/users/1', body, {});
    expect(result).toEqual(payload);
  });
});

describe('interceptor 401', () => {
  it('redirige a /login cuando recibe 401 y no está en /login', async () => {
    window.location.pathname = '/dashboard';

    await errorInterceptor({ response: { status: 401 } });

    expect(window.location.href).toBe('/login');
  });

  it('NO redirige cuando recibe 401 estando ya en /login', async () => {
    window.location.pathname = '/login';
    const error = { response: { status: 401 } };

    await expect(errorInterceptor(error)).rejects.toEqual(error);
    expect(window.location.href).not.toBe('/login');
  });

  it('rechaza el error para status distinto de 401', async () => {
    const error = { response: { status: 500 } };

    await expect(errorInterceptor(error)).rejects.toEqual(error);
  });
});
