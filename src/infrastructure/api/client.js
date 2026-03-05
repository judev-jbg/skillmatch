/**
 * Cliente HTTP central de la aplicación.
 * Configura baseURL, cookies httpOnly y manejo global de errores.
 */

const BASE_URL = `${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}`;

/**
 * Realiza una petición HTTP genérica.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {RequestInit} options - Opciones de fetch
 * @returns {Promise<any>} Datos de la respuesta parseados como JSON
 * @throws {Error} Si la respuesta no es exitosa
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Error en la petición');
  }

  if (response.status === 204) return null;

  return response.json();
}

/**
 * Realiza una petición GET.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {RequestInit} [options] - Opciones adicionales de fetch
 * @returns {Promise<any>}
 */
export function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'GET' });
}

/**
 * Realiza una petición POST.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {object} body - Cuerpo de la petición
 * @param {RequestInit} [options] - Opciones adicionales de fetch
 * @returns {Promise<any>}
 */
export function post(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
}

/**
 * Realiza una petición PUT.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {object} body - Cuerpo de la petición
 * @param {RequestInit} [options] - Opciones adicionales de fetch
 * @returns {Promise<any>}
 */
export function put(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
}
