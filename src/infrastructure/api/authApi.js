/**
 * Módulo de acceso a la API de autenticación.
 */

import { post } from './client.js';

/**
 * Llama a POST /auth/login con las credenciales del usuario.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ message: string, user: object }>}
 */
export function loginRequest(credentials) {
  return post('/auth/login', credentials);
}

/**
 * Llama a POST /auth/register con los datos del nuevo usuario.
 *
 * @param {{ name: string, email: string, password: string, role: string, organization_name?: string, area?: string }} data
 * @returns {Promise<{ message: string, user: object }>}
 */
export function registerRequest(data) {
  return post('/auth/register', data);
}

/**
 * Llama a POST /auth/logout para que el backend limpie la cookie HttpOnly.
 *
 * @returns {Promise<void>}
 */
export function logoutRequest() {
  return post('/auth/logout', {});
}
