import React, { useState, useMemo } from "react";
import { Package, Edit2, Trash2, Search, X } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";
import { getImageUrl } from "@/lib/utils";
import { ProductsService } from "@/lib/services/pb/products.service";
import type { ProductRecord } from "@/lib/types/pocketbase";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

interface InventoryListProps {
  inventory: ProductRecord[];
  setEditingProduct: (product: ProductRecord | null) => void;
  setView: (view: string) => void;
  selectedStoreId: string;
  reloadInventory: (storeId: string) => void;
}

export default function InventoryList({
  inventory,
  setEditingProduct,
  setView,
  selectedStoreId,
  reloadInventory,
}: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Eliminar producto definitivamente?")) {
      try {
        await ProductsService.delete(id);
        reloadInventory(selectedStoreId);
      } catch (err) {
        console.error("Error al eliminar el producto:", err);
      }
    }
  };

  // Filtrado de productos en tiempo real por nombre o marca
  const filteredInventory = useMemo(() => {
    if (!searchTerm.trim()) return inventory;
    const term = searchTerm.toLowerCase().trim();
    return inventory.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.brand && p.brand.toLowerCase().includes(term))
    );
  }, [inventory, searchTerm]);

  return (
    <div className="animate-in fade-in duration-300 w-full max-w-6xl mx-auto space-y-6">
      {/* Encabezado y Barra de Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-extrabold text-2xl tracking-tighter text-slate-900 flex items-center gap-3">
          <Package className="text-slate-400" /> Inventario Activo{" "}
          <span className="text-xs font-bold text-emerald-600 bg-emerald-600/10 px-3 py-1 rounded-full">
            {filteredInventory.length}{" "}
            {inventory.length !== filteredInventory.length &&
              `de ${inventory.length}`}
          </span>
        </h3>

        {/* Campo de Búsqueda */}
        {inventory.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o marca..."
              className="w-full bg-white border border-slate-200 rounded-full pl-11 pr-10 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lista o Estado Vacío */}
      {inventory.length > 0 ? (
        filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((p) => {
              const mainImage =
                p.images && p.images.length > 0 ? p.images[0] : undefined;
              // Mostrar precio devuelto de centavos a float
              const displayPrice = (p.price / 100).toFixed(2);
              const isListed = p.listed !== false;
              const isOutOfStock = p.stock === "out_of_stock";

              return (
                <div
                  key={p.id}
                  className={`bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 group transition-all shadow-xs hover:shadow-lg hover:-translate-y-1 ${
                    isOutOfStock || !isListed ? "opacity-75" : ""
                  }`}
                >
                  <div className="relative shrink-0">
                    <SafeImage
                      src={getImageUrl(p, mainImage, "100x100")}
                      alt={p.name}
                      className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 object-cover ${
                        isOutOfStock ? "grayscale" : ""
                      }`}
                    />
                    {p.images && p.images.length > 1 && (
                      <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg">
                        +{p.images.length - 1}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base md:text-lg leading-tight truncate text-slate-900">
                      {p.name}
                    </h4>
                    <p className="text-slate-900 font-extrabold tracking-tight mt-1">
                      {displayPrice}{" "}
                      <span className="text-[10px] font-medium text-slate-500">
                        USDT
                      </span>
                    </p>

                    {/* Badges de Estado, Stock y Visibilidad */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {/* Condición */}
                      {p.condition && (
                        <span className="text-[9px] uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-semibold">
                          {p.condition === "new"
                            ? "✨ Nuevo"
                            : p.condition === "open_box"
                            ? "📂 Open Box"
                            : "📦 Usado"}
                        </span>
                      )}

                      {/* Visibilidad (Publicado / Oculto) */}
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md font-bold ${
                          isListed
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {isListed ? "🌐 Publicado" : "👁️‍🗨️ Oculto"}
                      </span>

                      {/* Stock (Disponible / Agotado) */}
                      <span
                        className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md font-bold ${
                          isOutOfStock
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {isOutOfStock ? "❌ Agotado" : "✓ Disponible"}
                      </span>
                    </div>
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      title="Editar producto"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Estado sin coincidencias en la búsqueda */
          <div className="py-16 flex flex-col items-center justify-center text-center border border-slate-100 rounded-32px bg-white text-slate-400">
            <Search size={40} className="mb-3 opacity-40 text-slate-300" />
            <p className="font-bold text-sm text-slate-600 mb-1">
              No se encontraron productos
            </p>
            <p className="text-xs text-slate-400 mb-4">
              No hay coincidencias para "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs font-bold text-slate-900 hover:underline cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          </div>
        )
      ) : (
        /* Estado inventario completamente vacío */
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-white text-slate-400">
          <Package size={48} className="mb-4 opacity-50 text-slate-300" />
          <p className="font-bold text-sm mb-6 max-w-sm text-slate-500">
            Aún no tienes artículos en tu inventario. ¡Publica el primero para
            ver tus métricas!
          </p>
          <button
            onClick={() => setView("create")}
            className="px-8 py-3 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Edit2 size={16} /> Publicar Producto
          </button>
        </div>
      )}
    </div>
  );
}