import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, ArrowLeft, Filter, Phone } from "lucide-react";
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

        const storeRecord = await StoreService.getStoreBySlug(slug);

        if (!storeRecord) {
          setIsLoading(false);
          return;
        }

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
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-slate-300 animate-pulse border-4 border-white shadow-xl -mt-14 md:-mt-20 mb-8 mx-auto md:mx-0"></div>
          <div className="h-10 bg-slate-300 animate-pulse rounded w-1/3 mb-4 mx-auto md:mx-0"></div>
          <div className="h-4 bg-slate-300 animate-pulse rounded w-1/4 mb-12 mx-auto md:mx-0"></div>
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

  const rawWhatsapp =
    (store as unknown as Record<string, string>).whatsapp || store.phone || "";
  const cleanWhatsapp = rawWhatsapp.replace(/\D/g, "");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      {/* Banner de la tienda */}
      <div className="h-44 sm:h-52 md:h-64 w-full bg-slate-900 overflow-hidden relative">
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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 sm:gap-4 md:gap-6 mb-8">
          {/* Contenedor del Logo (con el margen negativo aplicado sólo aquí) */}
          <div className="-mt-14 sm:-mt-16 md:-mt-20 shrink-0 z-20">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden">
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
          </div>

          {/* Información principal con padding top para bajar el título fuera del banner */}
          <div className="flex-1 text-center md:text-left pt-2 sm:pt-3 md:pt-6">
            {/* Título + Redes alineadas al nivel del título en Desktop */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5 justify-center md:justify-start">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                {store.name}
              </h1>

              {/* Botones de Contacto / Redes Sociales */}
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                {store.instagram && (
                  <a
                    href={`https://instagram.com/${store.instagram.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Instagram"
                    className="p-2.5 bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-full shadow-md hover:opacity-90 hover:scale-105 transition-all cursor-pointer"
                  >
                    <IconInstagram size={20} />
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
                    title="Facebook"
                    className="p-2.5 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer"
                  >
                    <IconFacebook size={20} />
                  </a>
                )}
                {cleanWhatsapp && (
                  <a
                    href={`https://wa.me/${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    title="WhatsApp"
                    className="p-2.5 bg-[#25D366] text-white rounded-full shadow-md hover:bg-[#20bd5a] hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Phone size={20} className="fill-white" />
                  </a>
                )}
              </div>
            </div>

            {/* Categorías de la Tienda */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      <Icon size={12} /> {cat.name}
                    </span>
                  );
                });
              })()}
            </div>

            {/* Ubicación Separada de las Categorías */}
            {store.location && (
              <div className="mt-3 flex items-center justify-center md:justify-start">
                <span className="inline-flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-slate-600 text-xs sm:text-sm font-medium bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <MapPin size={15} className="text-emerald-600 shrink-0" />
                  <span>{store.location}</span>
                  {store.maps_url && (
                    <a
                      href={store.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold hover:bg-emerald-100 transition-colors uppercase tracking-widest border border-emerald-200"
                    >
                      Ver en Maps
                    </a>
                  )}
                </span>
              </div>
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
        <div className="bg-white p-3 sm:p-5 rounded-3xl border border-slate-100 shadow-xl shadow-black/5 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide transition-all cursor-pointer ${
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
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
              const mainImage =
                p.images && p.images.length > 0 ? p.images[0] : null;
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
