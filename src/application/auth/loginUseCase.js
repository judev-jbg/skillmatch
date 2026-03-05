/**
 * Caso de uso: iniciar sesión.
 * Llama a la API y devuelve el usuario autenticado.
 */

import { loginRequest } from '../../infrastructure/api/authApi.js';

/**
 * Ejecuta el login contra la API.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<object>} Datos del usuario autenticado
 * @throws {Error} Si las credenciales son inválidas o hay error de red
 */
export async function loginUseCase(credentials) {
  const { user } = await loginRequest(credentials);
  return user;
}
