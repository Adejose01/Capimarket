import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import pb from "@/lib/pocketbase";
import { getImageUrl, formatWhatsAppNumber, SPRING_SLOW } from "@/lib/utils";
import PriceDisplay from "@/components/common/PriceDisplay";
import { motion } from "framer-motion";
import type { ProductRecord } from "@/lib/types/pocketbase";

export default function ProductDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<number>(0);

  // Gestos táctiles (Swipe)
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const record = await pb
          .collection("products")
          .getOne<ProductRecord>(id, {
            expand: "store,category",
          });
        setProduct(record);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const totalImagenes = product?.images?.length || 0;

  const anteriorImagen = useCallback(() => {
    if (totalImagenes <= 1) return;
    setImagenSeleccionada((prev) =>
      prev === 0 ? totalImagenes - 1 : prev - 1,
    );
  }, [totalImagenes]);

  const siguienteImagen = useCallback(() => {
    if (totalImagenes <= 1) return;
    setImagenSeleccionada((prev) =>
      prev === totalImagenes - 1 ? 0 : prev + 1,
    );
  }, [totalImagenes]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") anteriorImagen();
      if (e.key === "ArrowRight") siguienteImagen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [anteriorImagen, siguienteImagen]);

  // Manejo de Swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) siguienteImagen();
    if (isRightSwipe) anteriorImagen();
  };

  const contactarWhatsApp = () => {
    if (!product) return;
    const rawPhone = product.expand?.store?.whatsapp || "";
    const telefono = formatWhatsAppNumber(rawPhone);
    const nombreTienda = product.expand?.store?.name || "Tienda";
    const precio = (product.price / 100).toFixed(2);

    const mensaje = `Hola ${nombreTienda}, vi el *${product.name}* publicado en CapiMercado por *${precio}*.`;

    try {
      pb.collection("orders")
        .create({
          product: product.id,
          store: product.expand?.store?.id,
          status: "pending_whatsapp",
          price_snapshot: product.price,
        })
        .catch(() => {});
    } catch (error) {
      console.error(error);
    }

    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={() => navigate(-1)}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-6xl h-[80vh] bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col p-6 lg:p-10"
        >
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
            <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl w-full h-full" />
            <div className="flex flex-col gap-6 pt-10">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded w-full mt-8" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!product) return null;

  const isOutOfStock = product.stock === "out_of_stock";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => navigate(-1)}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={SPRING_SLOW}
        className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col no-scrollbar pb-0 md:pb-0"
      >
        {/* Nav Header Sticky */}
        <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-white/5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-10 w-full pb-28 md:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Lado Izquierdo: Galería */}
            <div className="flex flex-col gap-4">
              <div
                className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] relative select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={getImageUrl(
                    product,
                    product.images?.[imagenSeleccionada],
                    "800x800",
                  )}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {totalImagenes > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={anteriorImagen}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all shadow-md cursor-pointer"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={siguienteImagen}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md text-slate-800 dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all shadow-md cursor-pointer"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight size={20} />
                    </button>

                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {imagenSeleccionada + 1} / {totalImagenes}
                    </div>
                  </>
                )}
              </div>

              {/* Tiras de Miniaturas */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(product, img, "100x100")}
                      alt={`Miniatura ${idx + 1}`}
                      className={`w-20 h-20 shrink-0 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                        imagenSeleccionada === idx
                          ? "border-slate-900 dark:border-white opacity-100 scale-95"
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-95"
                      }`}
                      onClick={() => setImagenSeleccionada(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Lado Derecho: Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <p
                  className="text-sm font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:underline transition-all"
                  style={{
                    color: product.expand?.store?.primaryColor || "#3b82f6",
                  }}
                  onClick={() =>
                    navigate(
                      `/stores/${product.expand?.store?.slug || product.expand?.store?.id}`,
                    )
                  }
                >
                  {product.expand?.store?.name || "CapiMercado"}
                </p>
                {product.expand?.store?.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
                    ✓ Verificado
                  </span>
                )}
              </div>

              {product.expand?.store?.created && (
                <p className="text-[10px] font-medium text-slate-400 mb-3">
                  Tienda miembro desde{" "}
                  {new Date(product.expand.store.created).toLocaleDateString(
                    "es",
                    { month: "long", year: "numeric" },
                  )}
                </p>
              )}

              <h1 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="mb-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <PriceDisplay
                  amount={product.price}
                  className="scale-125 origin-left"
                />
              </div>

              <div className="mb-8 p-6 bg-slate-50 dark:bg-[#111] rounded-2xl border border-slate-100 dark:border-white/5 space-y-6">
                {/* 1. Condición */}
                <div className="pb-6 border-b border-slate-200 dark:border-white/10">
                  <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-1">
                    Condición
                  </p>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                    {product.condition === "new"
                      ? "✨ Nuevo Sellado"
                      : product.condition === "open_box"
                        ? "📂 Abierto (Open Box)"
                        : "📦 Usado"}
                  </p>
                </div>

                {/* 2. Stock */}
                <div className="pb-6 border-b border-slate-200 dark:border-white/10">
                  <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-2">
                    Stock
                  </p>
                  <div>
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                        ❌ Agotado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                        ✅ Disponible
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Marca (if exist) */}
                {product.brand && (
                  <div className="pb-6 border-b border-slate-200 dark:border-white/10">
                    <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-1">
                      Marca
                    </p>
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                      {product.brand}
                    </p>
                  </div>
                )}

                {/* 4. Descripción */}
                <div>
                  <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-2">
                    Descripción
                  </p>
                  <div
                    className={`text-base leading-relaxed whitespace-pre-line ${
                      product.description
                        ? "text-slate-700 dark:text-slate-200"
                        : "text-orange-600 dark:text-slate-400 font-medium"
                    }`}
                  >
                    {product.description || "[ Sin descripción ]"}
                  </div>
                </div>
              </div>

              {/* CTA Desktop */}
              <div className="hidden md:flex flex-col gap-3 mt-auto">
                <button
                  onClick={contactarWhatsApp}
                  className="w-full bg-[#050505] hover:bg-[#1a1a1a] dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-[#FDFBF7] font-bold py-4 px-8 rounded-full shadow-premium flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-lg cursor-pointer"
                >
                  <MessageCircle
                    size={22}
                    className="text-emerald-400 dark:text-emerald-600"
                  />
                  Comprar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-110 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-4 py-3 safe-area-bottom shadow-2xl shadow-black/20">
          <button
            onClick={contactarWhatsApp}
            className="w-full bg-[#050505] dark:bg-white dark:text-slate-900 text-white font-bold py-3.5 px-4 rounded-full flex items-center justify-center gap-2 text-sm active:scale-95 transition-transform cursor-pointer"
          >
            <MessageCircle
              size={18}
              className="text-emerald-400 dark:text-emerald-600"
            />
            Comprar por WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
}
