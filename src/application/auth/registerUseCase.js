/**
 * Caso de uso: registrar un nuevo usuario.
 * Llama a la API y devuelve el usuario creado.
 */

import { registerRequest } from '../../infrastructure/api/authApi.js';

/**
 * Ejecuta el registro contra la API.
 *
 * @param {{ name: string, email: string, password: string, role: string, organization_name?: string, area?: string }} data
 * @returns {Promise<object>} Datos del usuario creado
 * @throws {Error} Si el email ya existe (409) o hay error de red
 */
export async function registerUseCase(data) {
  const { user } = await registerRequest(data);
  return user;
}
