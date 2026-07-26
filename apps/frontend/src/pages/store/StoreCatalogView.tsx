import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, Filter } from "lucide-react";
import { StoreService } from "@/lib/services/pb/store.service";
import { ProductsService } from "@/lib/services/pb/products.service";
import { CategoriesService } from "@/lib/services/pb/categories.service";
import type {
  StoreRecord,
  ProductRecord,
  CategoryRecord,
} from "@/lib/types/pocketbase";
import { getImageUrl, getCategoryIcon } from "@/lib/utils";
import ProductCard from "@/components/features/marketplace/ProductCard";
import SafeImage from "@/components/common/SafeImage";
import { IconInstagram, IconFacebook } from "@/assets/icons/socialIcons";

export default function StoreCatalogView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [store, setStore] = useState<StoreRecord | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [allCategories, setAllCategories] = useState<CategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoreData = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);

        // 1. Obtener la tienda por slug a través del servicio
        const storeRecord = await StoreService.getStoreBySlug(slug);

        if (!storeRecord) {
          setIsLoading(false);
          return;
        }

        // 2. Cargar en paralelo productos de la tienda y categorías globales mediante servicios
        const [productsRecord, categoriesRecord] = await Promise.all([
          ProductsService.getProductsByStoreId(storeRecord.id),
          CategoriesService.getAllCategories(),
        ]);

        setStore(storeRecord);
        setProducts(productsRecord);
        setAllCategories(categoriesRecord);
      } catch (error) {
        console.error("Error al cargar la tienda:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [slug]);

  const availableCategories = useMemo(() => {
    const catNames = products
      .map((p) => (p.expand?.category as CategoryRecord | undefined)?.name)
      .filter((name): name is string => Boolean(name));

    return ["Todos", ...Array.from(new Set(catNames))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory === "Todos") return true;
      const catName = (p.expand?.category as CategoryRecord | undefined)?.name;
      return catName === activeCategory;
    });
  }, [products, activeCategory]);

  if (isLoading || !store) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="h-48 md:h-64 w-full bg-slate-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-300 animate-pulse border-4 border-white shadow-xl -mt-16 md:-mt-20 mb-8"></div>
          <div className="h-10 bg-slate-300 animate-pulse rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-300 animate-pulse rounded w-1/4 mb-12"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-3/4 bg-slate-200 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      {/* Banner de la tienda */}
      <div className="h-48 md:h-64 w-full bg-slate-900 overflow-hidden relative">
        {store.banner ? (
          <img
            src={getImageUrl(store, store.banner ?? undefined, "1200x400")}
            alt="Banner"
            className="w-full h-full object-cover block"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-r from-slate-800 to-slate-900" />
        )}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 transition-all backdrop-blur-md z-20 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-16 md:-mt-20 mb-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden shrink-0 z-20">
            {store.logo ? (
              <SafeImage
                src={getImageUrl(store, store.logo ?? undefined, "200x200")}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-300">
                {store.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left mb-23 md:mb-0">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              {store.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              {(() => {
                const catIds = Array.isArray(store.category)
                  ? store.category
                  : store.category
                  ? [store.category]
                  : [];
                return catIds.map((catId) => {
                  const cat = allCategories.find((c) => c.id === catId);
                  if (!cat) return null;
                  const Icon = getCategoryIcon(cat.name);
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider"
                    >
                      <Icon size={12} /> {cat.name}
                    </span>
                  );
                });
              })()}
              {store.location && (
                <span className="inline-flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <MapPin size={16} /> {store.location}
                  {store.maps_url && (
                    <a
                      href={store.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest border border-emerald-200"
                    >
                      Ver en Maps
                    </a>
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3 mb-2 md:mb-4">
            {store.instagram && (
              <a
                href={`https://instagram.com/${store.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-pink-500 transition-colors p-2 bg-white rounded-full shadow-sm border border-slate-100"
              >
                <IconInstagram size={24} />
              </a>
            )}
            {store.facebook && (
              <a
                href={
                  store.facebook.startsWith("http")
                    ? store.facebook
                    : `https://facebook.com/${store.facebook}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-500 transition-colors p-2 bg-white rounded-full shadow-sm border border-slate-100"
              >
                <IconFacebook size={24} />
              </a>
            )}
          </div>
        </div>
        {store.description && (
          <p className="text-slate-600 text-sm md:text-base mb-8 max-w-3xl text-center md:text-left leading-relaxed">
            {store.description}
          </p>
        )}
      </div>

      {/* Categorías filtro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mt-4">
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xl shadow-black/5 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((p) => {
              const displayCondition =
                p.condition === "new"
                  ? "✨ Nuevo"
                  : p.condition === "open_box"
                  ? "📂 Open Box"
                  : "📦 Usado";
              const isOutOfStock = p.stock === "out_of_stock";
              const mainImage = p.images && p.images.length > 0 ? p.images[0] : null;
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  activeStoreName={store.name}
                  storeBrandColor={store.primaryColor || "#0f172a"}
                  mainImage={mainImage}
                  getImageUrl={getImageUrl}
                  displayCondition={displayCondition}
                  isOutOfStock={isOutOfStock}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center opacity-50">
            <Filter className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold mb-2">Sin productos</h3>
            <p className="font-medium max-w-sm text-sm">
              Esta tienda no tiene productos en la categoría actual.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}