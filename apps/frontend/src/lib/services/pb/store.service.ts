import pb from "@/lib/pocketbase";

// 1. Interfaces TypeScript basadas en el esquema de la colección 'stores'

export type StoreStatus = "pending" | "approved" | "suspended";
export type StoreMembershipType = "free" | "premium" | "enterprise";

export interface StoreInput {
  ownerId: string; // Relation -> users (Nonempty)
  name: string; // Text (Nonempty)
  slug?: string; // Text (Opcional: se autogenera si no se proporciona)
  instagram: string; // Text (Nonempty)
  whatsapp: string; // Text (Nonempty)
  correo: string; // Email (Nonempty)
  category?: string; // Text
  description?: string; // Text
  location?: string; // Text
  status?: StoreStatus; // Select
  membershipType?: StoreMembershipType; // Select
  membershipStatus?: boolean; // Bool
  verified?: boolean; // Bool
  primaryColor?: string; // Text (Hex code, ej: '#000000')
  mapsUrl?: string; // URL
  logoFile?: File; // File Single
  bannerFile?: File; // File Single
  deleteLogo?: boolean;
  deleteBanner?: boolean;
}

export interface GetStoresOptions {
  page?: number;
  perPage?: number;
  ownerId?: string;
  status?: StoreStatus;
  searchTerm?: string;
  verifiedOnly?: boolean;
}

export const StoreService = {
  // --- HELPERS INTERNOS ---

  /**
   * Normaliza y genera un slug amigable a partir de una cadena
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
      .replace(/[^a-z0-9 -]/g, "") // Elimina caracteres especiales
      .replace(/\s+/g, "-") // Reemplaza espacios por guiones
      .replace(/-+/g, "-"); // Elimina guiones dobles
  },

  /**
   * Garantiza que el slug sea único consultando la base de datos
   */
  async ensureUniqueSlug(
    baseName: string,
    currentStoreId?: string,
  ): Promise<string> {
    let slug = this.generateSlug(baseName);

    try {
      const existing = await pb
        .collection("stores")
        .getFirstListItem(`slug = "${slug}"`);

      if (existing && existing.id !== currentStoreId) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        slug = `${slug}-${randomSuffix}`;
      }
    } catch (err: any) {
      // 404 indica que el slug está disponible
    }

    return slug;
  },

  /**
   * Prepara el FormData según la especificación de la documentación de PocketBase
   */
  buildFormData(data: StoreInput): FormData {
    const fd = new FormData();

    // Campos obligatorios (Nonempty)
    fd.append("owner", data.ownerId);
    fd.append("name", data.name.trim());
    if (data.slug) {
      fd.append("slug", data.slug.trim());
    }
    fd.append("instagram", data.instagram.trim());
    fd.append("whatsapp", data.whatsapp.trim());
    fd.append("correo", data.correo.trim().toLowerCase());

    // Campos Select (Enviados directamente como valor escalar o manejados por FormData)
    fd.append("status", data.status || "pending");
    fd.append("membership_type", data.membershipType || "free");

    // Booleans
    fd.append("membership_status", String(data.membershipStatus ?? true));
    fd.append("verified", String(data.verified ?? false));

    // Opcionales
    if (data.category) fd.append("category", data.category.trim());
    if (data.description) fd.append("description", data.description.trim());
    if (data.location) fd.append("location", data.location.trim());
    if (data.primaryColor) fd.append("primaryColor", data.primaryColor.trim());
    if (data.mapsUrl) fd.append("maps_url", data.mapsUrl.trim());

    // Manejo de Logo (subir o eliminar)
    if (data.logoFile) {
      fd.append("logo", data.logoFile);
    } else if (data.deleteLogo) {
      fd.append("logo", "");
    }

    // Manejo de Banner (subir o eliminar)
    if (data.bannerFile) {
      fd.append("banner", data.bannerFile);
    } else if (data.deleteBanner) {
      fd.append("banner", "");
    }

    return fd;
  },

  // --- ESCRITURA (Mutations) ---

  /**
   * Crea una nueva tienda asegurando un slug único
   */
  async create(data: StoreInput) {
    if (!data.slug) {
      data.slug = await this.ensureUniqueSlug(data.name);
    }

    const fd = this.buildFormData(data);
    return await pb.collection("stores").create(fd);
  },

  /**
   * Actualiza la información o las imágenes de una tienda
   */
  async update(id: string, data: StoreInput) {
    if (!data.slug && data.name) {
      data.slug = await this.ensureUniqueSlug(data.name, id);
    }

    const fd = this.buildFormData(data);
    return await pb.collection("stores").update(id, fd);
  },

  /**
   * Elimina una tienda por su ID
   */
  async delete(id: string) {
    return await pb.collection("stores").delete(id);
  },

  // --- LECTURA (Queries) ---

  /**
   * Obtiene una tienda por su ID resolviendo relaciones con sintaxis oficial
   */
  async getById(id: string) {
    return await pb.collection("stores").getOne(id, {
      expand: "owner",
    });
  },

  /**
   * Obtiene una tienda directamente mediante su slug público
   */
  async getBySlug(slug: string) {
    return await pb.collection("stores").getFirstListItem(`slug = "${slug}"`, {
      expand: "owner",
    });
  },

  /**
   * Obtiene todas las tiendas asociadas a un usuario específico
   */
  async getByOwner(ownerId: string, expand = false) {
    return await pb.collection("stores").getFullList({
      filter: `owner = "${ownerId}"`,
      // sort: "-created",
      expand: expand ? "owner" : "",
    });
  },

  /**
   * Obtiene lista paginada de tiendas con filtros para el catálogo
   */
  async getList(options: GetStoresOptions = {}) {
    const {
      page = 1,
      perPage = 20,
      ownerId,
      status = "approved",
      searchTerm,
      verifiedOnly = false,
    } = options;

    const filters: string[] = [];

    if (status) filters.push(`status = "${status}"`);
    if (ownerId) filters.push(`owner = "${ownerId}"`);
    if (verifiedOnly) filters.push("verified = true");
    if (searchTerm) {
      filters.push(
        `(name ~ "${searchTerm}" || description ~ "${searchTerm}" || category ~ "${searchTerm}")`,
      );
    }

    const filterString = filters.join(" && ");

    return await pb.collection("stores").getList(page, perPage, {
      filter: filterString,
      // sort: "-created",
      expand: "owner",
    });
  },
};
