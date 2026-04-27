import { create } from 'zustand';
import pb from '../lib/pocketbase';

const useAuthStore = create((set) => ({
  // --- Estado ---
  user: pb.authStore.isValid ? pb.authStore.model : null,
  isAuthenticated: pb.authStore.isValid,
  isLoading: false,

  // --- Acciones ---
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await pb.collection('users').authWithPassword(email, password);
      set({ user: pb.authStore.model, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err };
    }
  },

  register: async ({ email, password, passwordConfirm, name }) => {
    set({ isLoading: true });
    try {
      await pb.collection('users').create({ email, password, passwordConfirm, name });
      await pb.collection('users').authWithPassword(email, password);
      set({ user: pb.authStore.model, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err };
    }
  },

  logout: () => {
    pb.authStore.clear();
    set({ user: null, isAuthenticated: false });
  },

  // Refresh user data from authStore (útil si cambia externamente)
  checkAuth: () => {
    if (pb.authStore.isValid) {
      set({ user: pb.authStore.model, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
