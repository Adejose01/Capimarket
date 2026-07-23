// Logica de las llamadas a db para la Marketplaceview
import pb from "@/lib/pocketbase";

// 1. Definimos las interfaces (lo que en Dart serían tus Clases / Models)
export interface Category {
  id: string;
  name: string;
  parent_id?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  location?: string;
  verified: boolean;
  primaryColor?: string;
  logo?: string;
  banner?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  brand?: string;
  price: number;
  condition: string;
  store: string;
  listed: boolean;
  // PocketBase te permite expandir relaciones (lo equivalente a un JOIN)
  expand?: {
    store?: Store;
    category?: Category;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
  page: number;
  totalItems: number;
}

// 2. Parámetros de filtrado agrupados (Equivalente a un Data Class o Record en Dart)
export interface ProductFilterOptions {
  page: number;
  perPage: number;
  searchTerm?: string;
  activeCategory?: string;
  minPrice?: string;
  maxPrice?: string;
  filterCond?: string;
  filterLoc?: string;
  sortOrder?: string;
  exclusiveStoreId?: string | null;
  activeStoreId?: string | null;
}

// 3. La Clase Servicio (Patrón Singleton o instancia estática para inyección)
class MarketplaceService {
  // Equivalente a traer los catálogos iniciales
  async getInitialData(): Promise<{ categories: Category[]; stores: Store[] }> {
    const [categories, stores] = await Promise.all([
      pb.collection("categories").getFullList<Category>(),
      pb.collection("stores").getFullList<Store>(),
    ]);

    return { categories, stores };
  }

  // El método robusto de filtrado que limpia el useEffect de tu UI
  async getProducts(
    options: ProductFilterOptions,
  ): Promise<PaginatedResult<Product>> {
    let filterParams = 'store.status = "approved" && listed = true';

    if (options.exclusiveStoreId) {
      filterParams += ` && store = "${options.exclusiveStoreId}"`;
    } else if (options.activeStoreId) {
      filterParams += ` && store = "${options.activeStoreId}"`;
    }

    if (options.searchTerm) {
      filterParams += ` && (name ~ "${options.searchTerm}" || brand ~ "${options.searchTerm}")`;
    }

    // Nota: Pasamos la lista de categorías para poder evaluar el parent_id si es necesario,
    // o puedes manejar la lógica del mapping de la categoría aquí dentro de forma limpia.
    if (options.activeCategory && options.activeCategory !== "Todos") {
      // Idealmente, podemos resolver el ID de la categoría aquí o recibir directamente el ID
      filterParams += ` && category.name = "${options.activeCategory}"`;
    }

    if (options.minPrice) {
      filterParams += ` && price >= ${Number(options.minPrice) * 100}`;
    }
    if (options.maxPrice) {
      filterParams += ` && price <= ${Number(options.maxPrice) * 100}`;
    }
    if (options.filterCond && options.filterCond !== "all") {
      filterParams += ` && condition = "${options.filterCond}"`;
    }
    if (options.filterLoc && options.filterLoc !== "all") {
      filterParams += ` && store.location = "${options.filterLoc}"`;
    }

    // Ejecutamos la petición paginada de PocketBase apuntando a nuestro Modelo genérico
    const result = await pb
      .collection("products")
      .getList<Product>(options.page, options.perPage, {
        expand: "store,category",
        filter: filterParams,
        requestKey: null, // Evita cancelaciones automáticas duplicadas si se dispara rápido
        ...(options.sortOrder ? { sort: options.sortOrder } : {}),
      });

    return {
      items: result.items,
      totalPages: result.totalPages,
      page: result.page,
      totalItems: result.totalItems,
    };
  }
}

// Exportamos una única instancia de la clase (Singleton conceptual)
export const marketplaceService = new MarketplaceService();
