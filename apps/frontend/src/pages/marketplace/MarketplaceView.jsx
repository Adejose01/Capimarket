import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import SafeImage from "@/components/common/SafeImage";
import Navbar from "@/components/common/Navbar";
import HeroCinematic from "@/components/HeroCinematic";
import CategoryBentoGrid from "@/components/features/marketplace/CategoryBentoGrid";
import CatalogHeader from "@/components/features/marketplace/CatalogHeader";
import ProductGrid from "@/components/features/marketplace/ProductGrid";
import FilterPanel from "@/components/features/marketplace/FilterPanel";
import AppliedFilterChips from "@/components/features/marketplace/AppliedFilterChips";
import CategoryBar from "@/components/features/marketplace/CategoryBar";
import StoreGrid from "@/components/features/marketplace/StoreGrid";
import useDebounce from "@/hooks/useDebounce";
import Footer from "@/components/common/Footer";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Hooks
import { useMarketplaceFilters } from "@/hooks/marketplace/useMarketplaceFilters";
import { useMarketplaceData } from "@/hooks/marketplace/useMarketplaceData";

export default function MarketplaceView({
  exclusiveStoreId = null,
  exclusiveStoreSlug = null,
}) {
  const navigate = useNavigate();

  // 1. Estados de Filtros desestructurados + Helpers del Hook
  const { filterState, dispatch, setFilter, resetFilters } =
    useMarketplaceFilters();

  const {
    activeCategory,
    minPrice,
    maxPrice,
    filterCond,
    filterLoc,
    sortOrder,
    currentPage,
  } = filterState;

  // 2. UI States
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => {
    return typeof window !== "undefined" ? window.scrollY > 20 : false;
  });

  // 3. Buscador
  const [searchType, setSearchType] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(
    searchTerm,
    300,
  );

  // 4. Custom Hook de Carga de Datos
  const {
    stores,
    products,
    categories,
    activeStore,
    setActiveStore,
    isLoading,
    isInitialLoading,
    totalPages,
  } = useMarketplaceData({
    exclusiveStoreId,
    exclusiveStoreSlug,
    filterState,
    debouncedSearchTerm,
  });

  const catalogRef = useRef(null);

  // Auto-scroll al buscar
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== "") {
      catalogRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [debouncedSearchTerm]);

  // Detector de Scroll para la Navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // [ CATEGORIAS DISPONIBLES ]

  // Listas Dinámicas — Categorías Raíz
  // const availableCategories = useMemo(() => {
  //   if (!categories || categories.length === 0) return ["Todos"];
  //   const roots = categories.filter((c) => !c.parent_id).map((c) => c.name);
  //   const list = ["Todos", ...roots];

  //   if (activeCategory !== "Todos" && !list.includes(activeCategory)) {
  //     list.push(activeCategory);
  //   }
  //   return list;
  // }, [categories, activeCategory]);

  const availableLocations = [
    "all",
    ...new Set(stores?.map((s) => s.location).filter(Boolean)),
  ];

  const filteredStores = useMemo(
    () =>
      stores.filter((store) => {
        const storeCatIds = Array.isArray(store.category)
          ? store.category
          : store.category
            ? [store.category]
            : [];

        const matchesSearch =
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          storeCatIds.some((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              cat && cat.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });

        const matchesCategory =
          activeCategory === "Todos" ||
          storeCatIds.some((catId) => {
            const cat = categories.find((c) => c.id === catId);
            if (!cat) return false;
            const selectedCat = categories.find(
              (c) => c.name === activeCategory,
            );
            return (
              cat.id === selectedCat?.id || cat.parent_id === selectedCat?.id
            );
          });

        return store.status === "approved" && matchesSearch && matchesCategory;
      }),
    [stores, searchTerm, activeCategory, categories],
  );

  const filteredProducts = products;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-slate-200 flex flex-col">
      {/* --- NAVBAR --- */}
      <Navbar
        isScrolled={isScrolled}
        activeStore={activeStore}
        exclusiveStoreId={exclusiveStoreId}
        searchType={searchType}
        setSearchType={setSearchType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onResetStore={() => {
          setActiveStore(null);
          setSearchTerm("");
          setFilter("activeCategory", "Todos");
        }}
      />

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="grow"
        style={{ willChange: "transform" }}
      >
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-green rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-xl font-bold text-slate-900">
              CapiMercado: Preparando vitrinas...
            </p>
          </div>
        ) : (
          <>
            {/* --- HERO SECTION --- */}
            <section className="mb-0">
              <HeroCinematic
                onExplore={() =>
                  document
                    .getElementById("catalogo")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            </section>

            {/* --- BENTO CATEGORY GRID --- */}
            {!activeStore && searchType === "products" && (
              <section
                id="catalogo"
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-16 sm:mb-20"
              >
                <CategoryBentoGrid
                  categories={categories}
                  onSelectCategory={(cat) => {
                    setFilter("activeCategory", cat);
                    document
                      .getElementById("catalogo")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              </section>
            )}

            {/* PARA REACTIVAR ESTA SECCION HACE FALTA DESCOMENTAR CATEGORIAS DISPONIBLES*/}

            {/* --- FILTER CHIPS: Sticky Horizontal Bar --- */}
            {/* <section className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm mb-8 sm:mb-12 transition-all duration-300">
              <CategoryBar
                availableCategories={availableCategories}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => {
                  setFilter("activeCategory", cat);
                  document.getElementById("catalogo")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
            </section> */}

            {/* --- DYNAMIC GRID --- */}
            <section
              id="catalogo"
              ref={catalogRef}
              className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[40vh] scroll-mt-20 pb-32 sm:pb-20"
            >
              <CatalogHeader
                searchType={searchType}
                activeStore={activeStore}
                sortOrder={sortOrder}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                dispatch={dispatch}
              />

              {/* APPLIED FILTER CHIPS */}
              <AppliedFilterChips
                searchType={searchType}
                activeCategory={activeCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                filterCond={filterCond}
                filterLoc={filterLoc}
                debouncedSearchTerm={debouncedSearchTerm}
                setSearchTerm={setSearchTerm}
                setDebouncedSearchTerm={setDebouncedSearchTerm}
                setFilter={setFilter}
                resetFilters={resetFilters}
              />

              {/* PRO FILTERS PANEL */}
              {searchType === "products" && showFilters && (
                <FilterPanel
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  filterCond={filterCond}
                  filterLoc={filterLoc}
                  availableLocations={availableLocations}
                  setFilter={setFilter}
                  resetFilters={resetFilters}
                />
              )}

              {/* RENDERING STORES */}
              {searchType === "stores" && !activeStore && (
                <StoreGrid
                  stores={filteredStores}
                  categories={categories}
                  activeCategory={activeCategory}
                  onResetCategory={() => setFilter("activeCategory", "Todos")}
                  onSelectStore={(storeSlugOrId) =>
                    navigate(`/stores/${storeSlugOrId}`)
                  }
                />
              )}

              {/* RENDERING PRODUCTS */}
              {searchType === "products" && (
                <ProductGrid
                  products={filteredProducts}
                  isLoading={isLoading}
                  activeStoreName={activeStore ? activeStore.name : null}
                  getImageUrl={getImageUrl}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setPage={(page) =>
                    dispatch({ type: "SET_PAGE", payload: page })
                  }
                />
              )}
            </section>
          </>
        )}
      </motion.main>

      <Footer />
    </div>
  );
}
