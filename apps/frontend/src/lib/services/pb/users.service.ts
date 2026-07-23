import pb from "@/lib/pocketbase";

// 1. Interfaces TypeScript según el schema Auth de PocketBase

export interface CreateUserInput {
  email: string; // Nonempty
  password: string; // Nonempty
  passwordConfirm: string; // Required for creation
  name?: string;
  emailVisibility?: boolean;
  avatar?: File; // File Single
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  emailVisibility?: boolean;
  oldPassword?: string; // Requerido si se intenta cambiar la contraseña
  password?: string;
  passwordConfirm?: string;
  avatar?: File; // Archivo de imagen nuevo
  deleteAvatar?: boolean; // Para borrar el avatar actual
}

export interface UsersListOptions {
  page?: number;
  perPage?: number;
  searchTerm?: string;
  sort?: string;
}

export const UsersService = {
  // --- HELPERS INTERNOS ---

  /**
   * Construye un FormData en caso de que se envíe un archivo de avatar,
   * o devuelve un objeto JSON estándar si no hay archivos.
   */
  preparePayload(
    data: Record<string, any>,
    avatarFile?: File,
    deleteAvatar?: boolean,
  ): FormData | Record<string, any> {
    if (avatarFile || deleteAvatar) {
      const fd = new FormData();

      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          fd.append(key, String(data[key]));
        }
      });

      if (avatarFile) {
        fd.append("avatar", avatarFile);
      }

      if (deleteAvatar) {
        // En PocketBase asignas null o cadena vacía al campo para borrar un archivo single
        fd.append("avatar", "");
      }

      return fd;
    }

    // Si no hay imágenes, devolvemos el objeto JSON directo
    return data;
  },

  // --- AUTENTICACIÓN & SESIÓN ---

  /**
   * Inicia sesión con Email / Usuario y Password
   */
  async login(identity: string, password: string) {
    return await pb.collection("users").authWithPassword(identity, password);
  },

  /**
   * Cierra la sesión activa
   */
  logout() {
    pb.authStore.clear();
  },

  /**
   * Devuelve el usuario actualmente autenticado en el AuthStore
   */
  getCurrentUser() {
    return pb.authStore.record;
  },

  /**
   * Comprueba si hay una sesión válida
   */
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  // --- ESCRITURA & REGISTRO (Mutations) ---

  /**
   * Crea un nuevo usuario en la plataforma
   */
  async create(data: CreateUserInput, autoSendVerification = true) {
    const rawData = {
      email: data.email.trim(),
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      name: data.name?.trim() || "",
      emailVisibility: data.emailVisibility ?? true,
    };

    const payload = this.preparePayload(rawData, data.avatar);
    const record = await pb.collection("users").create(payload);

    if (autoSendVerification) {
      this.requestVerification(data.email).catch((err) => {
        console.warn("No se pudo enviar el correo de verificación:", err);
      });
    }

    return record;
  },

  /**
   * Actualiza el perfil de un usuario existente
   */
  async update(id: string, data: UpdateUserInput) {
    const rawData: Record<string, any> = {};

    if (data.name !== undefined) rawData.name = data.name.trim();
    if (data.email !== undefined) rawData.email = data.email.trim();
    if (data.emailVisibility !== undefined)
      rawData.emailVisibility = data.emailVisibility;
    if (data.password) {
      rawData.password = data.password;
      rawData.passwordConfirm = data.passwordConfirm;
      if (data.oldPassword) rawData.oldPassword = data.oldPassword;
    }

    const payload = this.preparePayload(
      rawData,
      data.avatar,
      data.deleteAvatar,
    );
    return await pb.collection("users").update(id, payload);
  },

  /**
   * Solicita el envío del correo de verificación
   */
  async requestVerification(email: string) {
    return await pb.collection("users").requestVerification(email);
  },

  /**
   * Solicita restablecer contraseña por email
   */
  async requestPasswordReset(email: string) {
    return await pb.collection("users").requestPasswordReset(email);
  },

  /**
   * Elimina una cuenta de usuario
   */
  async delete(id: string) {
    return await pb.collection("users").delete(id);
  },

  // --- LECTURA (Queries) ---

  /**
   * Obtiene la información de un usuario por su ID
   */
  async getById(id: string) {
    return await pb.collection("users").getOne(id);
  },

  /**
   * Obtiene una lista paginada de usuarios
   */
  async getList(options: UsersListOptions = {}) {
    const { page = 1, perPage = 20, searchTerm, sort = "-created" } = options;

    let filter = "";
    if (searchTerm) {
      filter = `name ~ "${searchTerm}" || email ~ "${searchTerm}"`;
    }

    return await pb.collection("users").getList(page, perPage, {
      filter,
      sort,
    });
  },
};
