import pb from "@/lib/pocketbase";

// 1. Tipado TypeScript basado en el schema exacto de PocketBase
export interface ProductInput {
  storeId: string; // Relation -> stores (Nonempty)
  name: string; // Text (Nonempty)
  description?: string; // Text/Editor
  condition: "new" | "open_box" | "used"; // Select Single (Nonempty)
  basePrice?: number; // Number (base_price en USDT decimales)
  price: number; // Number (price en USDT decimales - Nonzero)
  stock: "available" | "out_of_stock" | string; // Select Single
  brand?: string; // Text
  listed?: boolean; // Bool
  category: string; // Relation -> categories (Nonempty)
  newImages?: File[]; // File Multiple (images)
  imagesToDelete?: string[]; // Para remover archivos existentes
}

export interface GetProductsOptions {
  page?: number;
  perPage?: number;
  storeId?: string;
  categoryId?: string;
  searchTerm?: string;
  onlyListed?: boolean;
}

export const ProductsService = {
  // --- MÉTODOS DE ESCRITURA (Mutations) ---

  /**
   * Mapea y empaqueta el objeto DTO hacia FormData respetando los tipos de PocketBase
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

    // Campo Opcional: base_price
    if (
      data.basePrice !== undefined &&
      data.basePrice !== null &&
      data.basePrice > 0
    ) {
      const basePriceInCents = Math.round(data.basePrice * 100);
      fd.append("base_price", basePriceInCents.toString());
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
  async create(data: ProductInput) {
    const fd = this.buildFormData(data);
    return await pb.collection("products").create(fd);
  },

  /**
   * Actualiza un producto existente en PocketBase
   */
  async update(id: string, data: ProductInput) {
    const fd = this.buildFormData(data);
    return await pb.collection("products").update(id, fd);
  },

  /**
   * Elimina un producto por ID
   */
  async delete(id: string) {
    return await pb.collection("products").delete(id);
  },

  // --- MÉTODOS DE LECTURA (Queries) ---

  /**
   * Obtiene un registro individual resolviendo relaciones
   */
  async getById(id: string, expand: string[] = ["category", "store"]) {
    return await pb.collection("products").getOne(id, {
      expand: expand.join(","),
    });
  },

  /**
   * Obtiene lista paginada con filtros dinámicos
   */
  async getList(options: GetProductsOptions = {}) {
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

    const filterString = filters.join(" && ");

    return await pb.collection("products").getList(page, perPage, {
      filter: filterString,
      sort: "-created",
      expand: "category,store",
    });
  },

  /**
   * Trae todos los productos asociados a una tienda
   */
  async getByStore(storeId: string, onlyListed = false) {
    const filter = onlyListed
      ? `store = "${storeId}" && listed = true`
      : `store = "${storeId}"`;

    return await pb.collection("products").getFullList({
      filter: filter,
      // sort: "-created",
      expand: "category",
    });
  },
};
