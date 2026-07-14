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

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      // Intentamos la autenticación con Google
      // PocketBase abrirá un popup automáticamente.
      const authData = await pb.collection('users').authWithOAuth2({ 
        provider: 'google',
      });
      
      console.log("AuthData recibido de Google:", authData);

      // Sincronización de perfil si es necesario
      if (authData.meta && authData.meta.name && !authData.record.name) {
        try {
          await pb.collection('users').update(authData.record.id, {
            name: authData.meta.name,
          });
        } catch (updateErr) {
          console.warn("No se pudo actualizar el nombre del usuario desde Google:", updateErr);
        }
      }

      set({ user: pb.authStore.model, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      console.error("Error crítico en Google Auth:", err);
      set({ isLoading: false });
      // Devolvemos un error más descriptivo si es posible
      return { 
        success: false, 
        error: err.response?.data || { message: err.message || "Error desconocido en el servidor de autenticación" } 
      };
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
