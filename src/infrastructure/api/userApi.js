/**
 * Módulo de acceso a la API de usuarios.
 */

import { get } from './client.js';

/**
 * Obtiene el perfil del usuario autenticado desde GET /users/me.
 *
 * @returns {Promise<{ id: number, name: string, email: string, role: string, created_at: string }>}
 */
export function getMeRequest() {
  return get('/users/me');
}
