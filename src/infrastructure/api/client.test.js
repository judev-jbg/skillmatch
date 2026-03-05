/**
 * Tests para el cliente HTTP central (SMAPP-9).
 *
 * Criterios de aceptación:
 * - baseURL construida desde variables de entorno
 * - credentials: 'include' en cada petición
 * - 401 fuera de /login redirige a /login
 * - 401 en /login NO redirige (evita recarga de página)
 * - Errores HTTP lanzan Error con el mensaje del servidor
 * - 204 devuelve null
 * - get, post y put usan el método HTTP correcto
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get, post, put } from './client.js';

/** Crea un Response mock con el status y body indicados. */
function mockResponse(status, body = null, ok = true) {
  return {
    status,
    ok,
    statusText: 'Error',
    json: vi.fn().mockResolvedValue(body),
  };
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  // Restaurar pathname a raíz por defecto
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { pathname: '/', href: '' },
  });
});

describe('get', () => {
  it('llama a fetch con method GET y credentials include', async () => {
    global.fetch.mockResolvedValue(mockResponse(200, { data: 1 }));

    await get('/users');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }),
    );
  });

  it('devuelve los datos de la respuesta JSON', async () => {
    const payload = { id: 1, name: 'Ana' };
    global.fetch.mockResolvedValue(mockResponse(200, payload));

    const result = await get('/users/1');

    expect(result).toEqual(payload);
  });
});

describe('post', () => {
  it('llama a fetch con method POST y body serializado', async () => {
    global.fetch.mockResolvedValue(mockResponse(201, { id: 2 }));
    const body = { name: 'Ana' };

    await post('/users', body);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
        credentials: 'include',
      }),
    );
  });
});

describe('put', () => {
  it('llama a fetch con method PUT y body serializado', async () => {
    global.fetch.mockResolvedValue(mockResponse(200, { id: 1, name: 'Bob' }));
    const body = { name: 'Bob' };

    await put('/users/1', body);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/1'),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(body),
        credentials: 'include',
      }),
    );
  });
});

describe('interceptor 401', () => {
  it('redirige a /login cuando recibe 401 y no está en /login', async () => {
    window.location.pathname = '/dashboard';
    global.fetch.mockResolvedValue(mockResponse(401, null, false));

    await get('/protected');

    expect(window.location.href).toBe('/login');
  });

  it('NO redirige cuando recibe 401 estando ya en /login', async () => {
    window.location.pathname = '/login';
    global.fetch.mockResolvedValue(mockResponse(401, null, false));

    await post('/auth/login', { email: 'a@b.com', password: '123' });

    expect(window.location.href).not.toBe('/login');
  });
});

describe('manejo de errores HTTP', () => {
  it('lanza Error con el mensaje del servidor en respuestas no ok', async () => {
    global.fetch.mockResolvedValue({
      status: 500,
      ok: false,
      statusText: 'Internal Server Error',
      json: vi.fn().mockResolvedValue({ message: 'Error interno del servidor' }),
    });

    await expect(get('/fail')).rejects.toThrow('Error interno del servidor');
  });

  it('lanza Error con statusText si el body no es JSON válido', async () => {
    global.fetch.mockResolvedValue({
      status: 503,
      ok: false,
      statusText: 'Service Unavailable',
      json: vi.fn().mockRejectedValue(new Error('not json')),
    });

    await expect(get('/fail')).rejects.toThrow('Service Unavailable');
  });
});

describe('respuesta 204', () => {
  it('devuelve null cuando el status es 204', async () => {
    global.fetch.mockResolvedValue({
      status: 204,
      ok: true,
      json: vi.fn(),
    });

    const result = await get('/users/1');

    expect(result).toBeNull();
  });
});
