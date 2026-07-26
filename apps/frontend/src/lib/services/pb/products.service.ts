import pb from "@/lib/pocketbase";
import type { ListResult } from "pocketbase";
import type {
  ProductRecord,
  ProductInput,
  GetProductsOptions,
} from "@/lib/types/pocketbase";

export const ProductsService = {
  // --- MÉTODOS DE ESCRITURA (Mutations) ---

  /**
   * Mapea y empaqueta el objeto DTO hacia FormData respetando el esquema exacto de PocketBase
   */
  buildFormData(data: ProductInput): FormData {
    const fd = new FormData();

    // Campos Requeridos (Nonempty)
    fd.append("store", data.storeId);
    fd.append("name", data.name.trim());
    fd.append("condition", data.condition);
    fd.append("category", data.category);

    // LÓGICA FINANCIERA: Convertir USDT decimales a centavos para la DB
    if (data.price !== undefined && data.price !== null) {
      const priceInCents = Math.round(data.price * 100);
      fd.append("price", priceInCents.toString());
    }

    // Campo Opcional: original_price (en la DB es original_price, no base_price)
    const rawOriginalPrice = data.originalPrice;
    if (
      rawOriginalPrice !== undefined &&
      rawOriginalPrice !== null &&
      rawOriginalPrice > 0
    ) {
      const originalPriceInCents = Math.round(rawOriginalPrice * 100);
      fd.append("original_price", originalPriceInCents.toString());
    }

    // Ofertas y Descuentos
    if (data.onSale !== undefined) {
      fd.append("on_sale", String(data.onSale));
    }
    if (data.saleEndsAt) {
      fd.append("sale_ends_at", data.saleEndsAt);
    }

    // Otros campos opcionales / valores por defecto
    fd.append("stock", data.stock || "available");
    fd.append("listed", String(data.listed ?? true));

    if (data.brand) {
      fd.append("brand", data.brand.trim());
    }

    if (data.description) {
      fd.append("description", data.description.trim());
    }

    // Tags (Array -> JSON en PocketBase)
    if (data.tags && data.tags.length > 0) {
      fd.append("tags", JSON.stringify(data.tags));
    }

    // Subida de imágenes nuevas (Multiple)
    if (data.newImages && data.newImages.length > 0) {
      data.newImages.forEach((file) => {
        fd.append("images", file);
      });
    }

    // Eliminación de imágenes existentes (Sintaxis 'images-' de PocketBase)
    if (data.imagesToDelete && data.imagesToDelete.length > 0) {
      data.imagesToDelete.forEach((filename) => {
        fd.append("images-", filename);
      });
    }

    return fd;
  },

  /**
   * Crea un producto en PocketBase
   */
  async create(data: ProductInput): Promise<ProductRecord> {
    const fd = this.buildFormData(data);
    return await pb.collection("products").create<ProductRecord>(fd);
  },

  /**
   * Actualiza un producto existente en PocketBase
   */
  async update(id: string, data: ProductInput): Promise<ProductRecord> {
    const fd = this.buildFormData(data);
    return await pb.collection("products").update<ProductRecord>(id, fd);
  },

  /**
   * Elimina un producto por ID
   */
  async delete(id: string): Promise<boolean> {
    return await pb.collection("products").delete(id);
  },

  // --- MÉTODOS DE LECTURA (Queries) ---

  /**
   * Obtiene UN SOLO producto por su ID
   */
  async getProductById(
    id: string,
    expand: string[] = ["category", "store"],
  ): Promise<ProductRecord> {
    return await pb.collection("products").getOne<ProductRecord>(id, {
      expand: expand.join(","),
    });
  },

  /**
   * Trae todos los productos asociados a una tienda por su storeId
   */
  async getProductsByStoreId(
    storeId: string,
    onlyListed = false,
    expand: string[] = ["category", "store"],
  ): Promise<ProductRecord[]> {
    const filter = onlyListed
      ? `store = "${storeId}" && listed = true`
      : `store = "${storeId}"`;

    return await pb.collection("products").getFullList<ProductRecord>({
      filter,
      sort: "-created",
      expand: expand.join(","),
      requestKey: null,
    });
  },

  /**
   * Obtiene lista paginada con filtros dinámicos
   */
  async getList(
    options: GetProductsOptions = {},
  ): Promise<ListResult<ProductRecord>> {
    const {
      page = 1,
      perPage = 20,
      storeId,
      categoryId,
      searchTerm,
      onlyListed = true,
    } = options;

    const filters: string[] = [];

    if (onlyListed) filters.push("listed = true");
    if (storeId) filters.push(`store = "${storeId}"`);
    if (categoryId) filters.push(`category = "${categoryId}"`);
    if (searchTerm) {
      filters.push(
        `(name ~ "${searchTerm}" || description ~ "${searchTerm}" || brand ~ "${searchTerm}")`,
      );
    }

    return await pb
      .collection("products")
      .getList<ProductRecord>(page, perPage, {
        filter: filters.join(" && "),
        sort: "-created",
        expand: "category,store",
      });
  },
};
