/**
 * Módulo de acceso a la API de estudiantes.
 */

import { get, put } from './client.js';

/**
 * Obtiene el perfil completo del estudiante autenticado.
 *
 * @returns {Promise<object>} Perfil del estudiante
 */
export function getStudentMe() {
  return get('/students/me');
}

/**
 * Actualiza los datos del perfil del estudiante autenticado.
 *
 * @param {object} data - Campos a actualizar (disponibilidad, portfolio, etc.)
 * @returns {Promise<object>} Perfil actualizado
 */
export function updateStudentMe(data) {
  return put('/students/me', data);
}

/**
 * Actualiza las habilidades del estudiante autenticado.
 *
 * @param {{ skill_id: string, level: string }[]} skills - Lista de habilidades con nivel
 * @returns {Promise<object>} Habilidades actualizadas
 */
export function updateStudentSkills(skills) {
  return put('/students/me/skills', { skills });
}
