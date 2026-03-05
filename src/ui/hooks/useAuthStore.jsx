/**
 * Store global de autenticación con Zustand.
 * Expone el usuario actual y las acciones setUser/clearUser.
 */

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,

  /**
   * Establece el usuario autenticado en el store.
   *
   * @param {object} user
   */
  setUser: (user) => set({ user }),

  /**
   * Elimina el usuario del store (cierre de sesión).
   */
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
