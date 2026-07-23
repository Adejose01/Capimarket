import { create } from "zustand";
import {
  UsersService,
  CreateUserInput,
  UpdateUserInput,
} from "@/lib/services/pb/users.service"; // Ajusta la ruta según la ubicación de tu UsersService
import { RecordModel } from "pocketbase";

interface AuthResponse {
  success: boolean;
  error?: any;
}

interface AuthState {
  // Estado
  user: RecordModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Acciones
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: CreateUserInput) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  updateProfile: (id: string, data: UpdateUserInput) => Promise<AuthResponse>;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  // --- Estado inicial ---
  user: UsersService.getCurrentUser(),
  isAuthenticated: UsersService.isAuthenticated(),
  isLoading: false,

  // --- Acciones ---
  login: (email, password) => {
    set({ isLoading: true });
    return UsersService.login(email, password)
      .then(() => {
        set({
          user: UsersService.getCurrentUser(),
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      })
      .catch((err) => {
        set({ isLoading: false });
        return { success: false, error: err };
      });
  },

  register: (data) => {
    set({ isLoading: true });
    return UsersService.create(data)
      .then(() => UsersService.login(data.email, data.password))
      .then(() => {
        set({
          user: UsersService.getCurrentUser(),
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      })
      .catch((err) => {
        set({ isLoading: false });
        return { success: false, error: err };
      });
  },

  loginWithGoogle: () => {
    set({ isLoading: true });
    // OAuth2 sigue manejándose directo con pb ya que UsersService no lo expone
    return import("@/lib/pocketbase")
      .then(({ default: pb }) =>
        pb.collection("users").authWithOAuth2({ provider: "google" }),
      )
      .then((authData) => {
        if (authData.meta?.name && !authData.record.name) {
          return UsersService.update(authData.record.id, {
            name: authData.meta.name,
          }).catch((updateErr) => {
            console.warn(
              "No se pudo actualizar el nombre desde Google:",
              updateErr,
            );
          });
        }
      })
      .then(() => {
        set({
          user: UsersService.getCurrentUser(),
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      })
      .catch((err) => {
        console.error("Error crítico en Google Auth:", err);
        set({ isLoading: false });
        return {
          success: false,
          error: err?.response?.data || {
            message:
              err?.message ||
              "Error desconocido en el servidor de autenticación",
          },
        };
      });
  },

  updateProfile: (id, data) => {
    set({ isLoading: true });
    return UsersService.update(id, data)
      .then(() => {
        set({
          user: UsersService.getCurrentUser(),
          isLoading: false,
        });
        return { success: true };
      })
      .catch((err) => {
        set({ isLoading: false });
        return { success: false, error: err };
      });
  },

  logout: () => {
    UsersService.logout();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    if (UsersService.isAuthenticated()) {
      set({ user: UsersService.getCurrentUser(), isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
