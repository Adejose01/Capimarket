import pb from "@/lib/pocketbase";
import type { ListResult } from "pocketbase";
import type {
  StoreRecord,
  StoreInput,
  GetStoresOptions,
} from "@/lib/types/pocketbase";

export const StoreService = {
  // --- HELPERS INTERNOS ---

  /**
   * Normaliza y genera un slug amigable
   */
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  },

  /**
   * Garantiza que el slug sea único consultando la base de datos
   */
  async ensureUniqueSlug(
    baseName: string,
    currentStoreId?: string,
  ): Promise<string> {
    const slug = this.generateSlug(baseName);

    try {
      const existing = await pb
        .collection("stores")
        .getFirstListItem<StoreRecord>(`slug = "${slug}"`);

      if (existing && existing.id !== currentStoreId) {
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        return `${slug}-${randomSuffix}`;
      }
      return slug;
    } catch (err: any) {
      if (err?.status === 404) return slug;
      throw err;
    }
  },

  /**
   * Prepara el FormData para envío a PocketBase
   */
  buildFormData(data: StoreInput): FormData {
    const fd = new FormData();

    if (data.ownerId) fd.append("owner", data.ownerId);
    if (data.name) fd.append("name", data.name.trim());
    if (data.slug) fd.append("slug", data.slug.trim());
    if (data.instagram) fd.append("instagram", data.instagram.trim());
    if (data.whatsapp) fd.append("whatsapp", data.whatsapp.trim());
    if (data.correo) fd.append("correo", data.correo.trim().toLowerCase());

    if (data.status) fd.append("status", data.status);
    if (data.membershipType) fd.append("membership_type", data.membershipType);

    if (data.membershipStatus !== undefined) {
      fd.append("membership_status", String(data.membershipStatus));
    }
    if (data.verified !== undefined) {
      fd.append("verified", String(data.verified));
    }

    // MANEJO DE CATEGORÍAS MÚLTIPLES
    if (data.category) {
      if (Array.isArray(data.category)) {
        data.category.forEach((catId) => fd.append("category", catId));
      } else {
        fd.append("category", data.category);
      }
    }

    if (data.description) fd.append("description", data.description.trim());
    if (data.location) fd.append("location", data.location.trim());
    if (data.primaryColor) fd.append("primaryColor", data.primaryColor.trim());
    if (data.mapsUrl) fd.append("maps_url", data.mapsUrl.trim());

    // Archivos
    if (data.logoFile) {
      fd.append("logo", data.logoFile);
    } else if (data.deleteLogo) {
      fd.append("logo", "");
    }

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
  async create(data: StoreInput): Promise<StoreRecord> {
    try {
      const slug = data.slug
        ? data.slug
        : await this.ensureUniqueSlug(data.name || "tienda");

      data.slug = slug;
      const fd = this.buildFormData(data);

      return await pb.collection("stores").create<StoreRecord>(fd);
    } catch (error) {
      console.error("Error al crear la tienda:", error);
      throw error;
    }
  },

  /**
   * Actualiza la información o las imágenes de una tienda.
   * Soporta tanto un objeto `StoreInput` como un `FormData` directo.
   */
  async update(id: string, data: StoreInput | FormData): Promise<StoreRecord> {
    try {
      if (data instanceof FormData) {
        return await pb.collection("stores").update<StoreRecord>(id, data);
      }

      if (!data.slug && data.name) {
        data.slug = await this.ensureUniqueSlug(data.name, id);
      }

      const fd = this.buildFormData(data);
      return await pb.collection("stores").update<StoreRecord>(id, fd);
    } catch (error) {
      console.error(`Error al actualizar la tienda ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una tienda por su ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      return await pb.collection("stores").delete(id);
    } catch (error) {
      console.error(`Error al eliminar la tienda ${id}:`, error);
      throw error;
    }
  },

  // --- LECTURA (Queries) ---

  /**
   * Obtiene una tienda por su ID resolviendo relaciones
   */
  async getStoreById(id: string): Promise<StoreRecord | null> {
    try {
      return await pb.collection("stores").getOne<StoreRecord>(id, {
        expand: "owner,category",
      });
    } catch (error: any) {
      if (error?.status === 404) return null;
      console.error(`Error al obtener tienda por ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene una tienda directamente mediante su slug público
   */
  async getStoreBySlug(slug: string): Promise<StoreRecord | null> {
    try {
      return await pb
        .collection("stores")
        .getFirstListItem<StoreRecord>(`slug = "${slug}"`, {
          expand: "owner,category",
        });
    } catch (error: any) {
      if (error?.status === 404) return null;
      console.error(`Error al obtener tienda por slug (${slug}):`, error);
      throw error;
    }
  },

  /**
   * Obtiene todas las tiendas asociadas a un usuario específico
   */
  async getByOwner(ownerId: string, expand = false): Promise<StoreRecord[]> {
    try {
      return await pb.collection("stores").getFullList<StoreRecord>({
        filter: `owner = "${ownerId}"`,
        expand: expand ? "owner,category" : "",
      });
    } catch (error) {
      console.error(`Error al obtener tiendas del owner ${ownerId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene lista paginada de tiendas con filtros para el catálogo
   */
  async getList(
    options: GetStoresOptions = {},
  ): Promise<ListResult<StoreRecord>> {
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
      filters.push(`(name ~ "${searchTerm}" || description ~ "${searchTerm}")`);
    }

    try {
      return await pb.collection("stores").getList<StoreRecord>(page, perPage, {
        filter: filters.join(" && "),
        expand: "owner,category",
      });
    } catch (error) {
      console.error("Error al obtener la lista de tiendas:", error);
      throw error;
    }
  },
};
