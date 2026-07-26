import pb from "@/lib/pocketbase";
import { StoreService } from "@/lib/services/pb/store.service";
import type { ProductRecord } from "@/lib/types/pocketbase";
import { ProductsService } from "@/lib/services/pb/products.service"; // Asumiendo la ubicación de tu ProductsService

// 1. Interfaces TypeScript
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
  category?: string;
  listed: boolean;
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

// 2. Definición del Servicio usando Objeto / Funciones estáticas (consistente con StoreService)
export const MarketplaceService = {
  /**
   * Obtiene los catálogos iniciales para poblar los filtros (Categorías y Tiendas)
   */
  getInitialData(): Promise<{ categories: Category[]; stores: any[] }> {
    const categoriesPromise = pb
      .collection("categories")
      .getFullList<Category>();
    const storesPromise = StoreService.getList({
      status: "approved",
      perPage: 500,
    });

    return Promise.all([categoriesPromise, storesPromise])
      .then(([categories, storesResult]) => {
        return {
          categories,
          stores: storesResult.items,
        };
      })
      .catch((err) => {
        console.error("Error al obtener datos iniciales del marketplace:", err);
        return { categories: [], stores: [] };
      });
  },

  /**
   * Genera el string de filtros y consulta los productos paginados
   */
  getProducts(
    options: ProductFilterOptions,
  ): Promise<PaginatedResult<ProductRecord>> {
    const filters: string[] = ['store.status = "approved"', "listed = true"];

    if (options.exclusiveStoreId) {
      filters.push(`store = "${options.exclusiveStoreId}"`);
    } else if (options.activeStoreId) {
      filters.push(`store = "${options.activeStoreId}"`);
    }

    if (options.searchTerm) {
      filters.push(
        `(name ~ "${options.searchTerm}" || brand ~ "${options.searchTerm}")`,
      );
    }

    if (options.activeCategory && options.activeCategory !== "Todos") {
      filters.push(`category.name = "${options.activeCategory}"`);
    }

    if (options.minPrice) {
      filters.push(`price >= ${Number(options.minPrice) * 100}`);
    }

    if (options.maxPrice) {
      filters.push(`price <= ${Number(options.maxPrice) * 100}`);
    }

    if (options.filterCond && options.filterCond !== "all") {
      filters.push(`condition = "${options.filterCond}"`);
    }

    if (options.filterLoc && options.filterLoc !== "all") {
      filters.push(`store.location = "${options.filterLoc}"`);
    }

    const filterString = filters.join(" && ");

    // Petición a PocketBase usando promesas
    return pb
      .collection("products")
      .getList<ProductRecord>(options.page, options.perPage, {
        expand: "store,category",
        filter: filterString,
        requestKey: null,
        ...(options.sortOrder ? { sort: options.sortOrder } : {}),
      })
      .then((result) => ({
        items: result.items,
        totalPages: result.totalPages,
        page: result.page,
        totalItems: result.totalItems,
      }))
      .catch((err) => {
        console.error("Error al obtener productos filtrados:", err);
        return {
          items: [],
          totalPages: 0,
          page: options.page,
          totalItems: 0,
        };
      });
  },
};
