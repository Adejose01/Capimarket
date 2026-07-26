import { useState, useEffect } from "react";
import { MarketplaceService } from "@/lib/services/marketplace.service";
import { StoreService } from "@/lib/services/pb/store.service";
import { CategoriesService } from "@/lib/services/pb/categories.service";
import type {
  CategoryRecord,
  StoreRecord,
  ProductRecord,
} from "@/lib/types/pocketbase";

interface UseMarketplaceDataProps {
  exclusiveStoreId?: string | null;
  exclusiveStoreSlug?: string | null;
  filterState: {
    currentPage: number;
    activeCategory: string;
    minPrice: string;
    maxPrice: string;
    filterCond: string;
    filterLoc: string;
    sortOrder: string;
  };
  debouncedSearchTerm: string;
}

export function useMarketplaceData({
  exclusiveStoreId = null,
  exclusiveStoreSlug = null,
  filterState,
  debouncedSearchTerm,
}: UseMarketplaceDataProps) {
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [activeStore, setActiveStore] = useState<StoreRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  const {
    currentPage,
    activeCategory,
    minPrice,
    maxPrice,
    filterCond,
    filterLoc,
    sortOrder,
  } = filterState;

  // 1. Carga inicial: Ahora usamos CategoriesService.getActiveCategories()
  useEffect(() => {
    const init = async () => {
      try {
        // Cargar tiendas desde MarketplaceService y solo las categorías activas desde CategoriesService
        const [activeCats, { stores: strs }] = await Promise.all([
          CategoriesService.getActiveCategories(),
          MarketplaceService.getInitialData(),
        ]);

        setCategories(activeCats);
        setStores(strs);

        // Resolver la tienda activa si aplica
        if (exclusiveStoreSlug) {
          const st = await StoreService.getStoreBySlug(exclusiveStoreSlug);
          setActiveStore(st);
        } else if (exclusiveStoreId) {
          const st = await StoreService.getStoreById(exclusiveStoreId);
          setActiveStore(st);
        }
      } catch (err) {
        console.error("Init error in useMarketplaceData:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    init();
  }, [exclusiveStoreSlug, exclusiveStoreId]);

  // 2. Carga reactiva de productos según los filtros
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const result = await MarketplaceService.getProducts({
          page: currentPage,
          perPage: 20,
          searchTerm: debouncedSearchTerm,
          activeCategory,
          minPrice,
          maxPrice,
          filterCond,
          filterLoc,
          sortOrder,
          exclusiveStoreId,
          activeStoreId: activeStore ? activeStore.id : null,
        });

        setProducts(result.items);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [
    currentPage,
    debouncedSearchTerm,
    activeCategory,
    minPrice,
    maxPrice,
    filterCond,
    filterLoc,
    sortOrder,
    activeStore,
    exclusiveStoreId,
  ]);

  return {
    stores,
    products,
    categories,
    activeStore,
    setActiveStore,
    isLoading,
    isInitialLoading,
    totalPages,
  };
}
