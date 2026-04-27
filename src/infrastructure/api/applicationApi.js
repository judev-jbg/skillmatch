/**
 * Módulo de acceso a la API de aplicaciones a proyectos.
 */

import { get, post, put } from './client.js';

/**
 * Crea una aplicación del estudiante autenticado a un proyecto.
 *
 * @param {string} projectId - ID del proyecto
 * @returns {Promise<object>} Aplicación creada
 */
export function createApplication(projectId) {
  return post('/applications', { project_id: projectId });
}

/**
 * Obtiene las aplicaciones de un proyecto (para que la ONG vea candidatos).
 *
 * @param {string} projectId - ID del proyecto
 * @returns {Promise<object[]>} Lista de aplicaciones
 */
export function getApplicationsByProject(projectId) {
  return get('/applications', { params: { project_id: projectId } });
}

/**
 * Actualiza el estado de una aplicación (aprobada, rechazada, etc.).
 *
 * @param {string} id - ID de la aplicación
 * @param {string} status - Nuevo estado
 * @returns {Promise<object>} Aplicación actualizada
 */
export function updateApplicationStatus(id, status) {
  return put(`/applications/${id}`, { status });
}
