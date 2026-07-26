import pb from "@/lib/pocketbase";
import type { ListResult, RecordAuthResponse } from "pocketbase";
import type { UserRecord } from "@/lib/types/pocketbase";

export interface CreateUserInput {
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
  emailVisibility?: boolean;
  avatar?: File;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  emailVisibility?: boolean;
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
  avatar?: File;
  deleteAvatar?: boolean;
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
   * Construye un FormData en caso de que se envíe un archivo de avatar o eliminación del mismo,
   * o devuelve un objeto JSON estándar si no hay archivos involucrados.
   */
  preparePayload(
    data: Record<string, unknown>,
    avatarFile?: File,
    deleteAvatar?: boolean,
  ): FormData | Record<string, unknown> {
    if (avatarFile || deleteAvatar) {
      const fd = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          fd.append(key, String(value));
        }
      });

      if (avatarFile) {
        fd.append("avatar", avatarFile);
      } else if (deleteAvatar) {
        // En PocketBase asignar enviando string vacío al campo para borrar un archivo
        fd.append("avatar", "");
      }

      return fd;
    }

    return data;
  },

  // --- AUTENTICACIÓN & SESIÓN ---

  /**
   * Inicia sesión con Email / Username y Password
   */
  async login(
    identity: string,
    password: string,
  ): Promise<RecordAuthResponse<UserRecord>> {
    return await pb
      .collection("users")
      .authWithPassword<UserRecord>(identity, password);
  },

  /**
   * Cierra la sesión activa
   */
  logout(): void {
    pb.authStore.clear();
  },

  /**
   * Devuelve el usuario actualmente autenticado en el AuthStore
   */
  getCurrentUser(): UserRecord | null {
    return (pb.authStore.record as UserRecord | null) ?? null;
  },

  /**
   * Comprueba si hay una sesión válida
   */
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  // --- ESCRITURA & REGISTRO (Mutations) ---

  /**
   * Crea un nuevo usuario en la plataforma
   */
  async create(
    data: CreateUserInput,
    autoSendVerification = true,
  ): Promise<UserRecord> {
    const rawData = {
      email: data.email.trim(),
      password: data.password,
      passwordConfirm: data.passwordConfirm,
      name: data.name?.trim() || "",
      emailVisibility: data.emailVisibility ?? true,
    };

    const payload = this.preparePayload(rawData, data.avatar);
    const record = await pb.collection("users").create<UserRecord>(payload);

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
  async update(id: string, data: UpdateUserInput): Promise<UserRecord> {
    const rawData: Record<string, unknown> = {};

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
    return await pb.collection("users").update<UserRecord>(id, payload);
  },

  /**
   * Solicita el envío del correo de verificación
   */
  async requestVerification(email: string): Promise<boolean> {
    return await pb.collection("users").requestVerification(email);
  },

  /**
   * Solicita restablecer contraseña por email
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    return await pb.collection("users").requestPasswordReset(email);
  },

  /**
   * Elimina una cuenta de usuario
   */
  async delete(id: string): Promise<boolean> {
    return await pb.collection("users").delete(id);
  },

  // --- LECTURA (Queries) ---

  /**
   * Obtiene la información de un usuario por su ID
   */
  async getUserById(id: string): Promise<UserRecord> {
    return await pb.collection("users").getOne<UserRecord>(id);
  },

  /**
   * Obtiene una lista paginada de usuarios
   */
  async getList(
    options: UsersListOptions = {},
  ): Promise<ListResult<UserRecord>> {
    const { page = 1, perPage = 20, searchTerm, sort = "-created" } = options;

    let filter = "";
    if (searchTerm) {
      filter = `name ~ "${searchTerm}" || email ~ "${searchTerm}"`;
    }

    return await pb.collection("users").getList<UserRecord>(page, perPage, {
      filter,
      sort,
    });
  },
};
