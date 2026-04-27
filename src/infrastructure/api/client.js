/**
 * Cliente HTTP central de la aplicación basado en Axios.
 * Configura baseURL, cookies httpOnly y manejo global de errores.
 */

import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      window.location.href = '/login';
      return Promise.resolve();
    }
    return Promise.reject(error);
  },
);

/**
 * Realiza una petición GET.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {import('axios').AxiosRequestConfig} [config] - Configuración adicional de Axios
 * @returns {Promise<any>} Datos de la respuesta
 */
export function get(endpoint, config = {}) {
  return client.get(endpoint, config).then((res) => res.data);
}

/**
 * Realiza una petición POST.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {object} body - Cuerpo de la petición
 * @param {import('axios').AxiosRequestConfig} [config] - Configuración adicional de Axios
 * @returns {Promise<any>} Datos de la respuesta
 */
export function post(endpoint, body, config = {}) {
  return client.post(endpoint, body, config).then((res) => res.data);
}

/**
 * Realiza una petición PUT.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {object} body - Cuerpo de la petición
 * @param {import('axios').AxiosRequestConfig} [config] - Configuración adicional de Axios
 * @returns {Promise<any>} Datos de la respuesta
 */
export function put(endpoint, body, config = {}) {
  return client.put(endpoint, body, config).then((res) => res.data);
}

/**
 * Realiza una petición DELETE.
 *
 * @param {string} endpoint - Ruta relativa al baseURL
 * @param {import('axios').AxiosRequestConfig} [config] - Configuración adicional de Axios
 * @returns {Promise<any>} Datos de la respuesta
 */
export function del(endpoint, config = {}) {
  return client.delete(endpoint, config).then((res) => res.data);
}
