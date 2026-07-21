import { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";
import { marketplaceService } from "@/lib/services/MarketplaceService";

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
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeStore, setActiveStore] = useState<any | null>(null);

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

  // 1. Carga inicial de categorías, tiendas y tienda exclusiva
  useEffect(() => {
    const init = async () => {
      try {
        const { categories: cats, stores: strs } =
          await marketplaceService.getInitialData();
        setCategories(cats);
        setStores(strs);

        if (exclusiveStoreSlug) {
          const st = await pb
            .collection("stores")
            .getFirstListItem(`slug="${exclusiveStoreSlug}"`);
          setActiveStore(st);
        } else if (exclusiveStoreId) {
          const st = await pb.collection("stores").getOne(exclusiveStoreId);
          setActiveStore(st);
        }
      } catch (err) {
        console.error("Init error in useMarketplaceData:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    init();
  }, [exclusiveStoreId, exclusiveStoreSlug]);

  // 2. Carga reactiva de productos según los filtros
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const result = await marketplaceService.getProducts({
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
