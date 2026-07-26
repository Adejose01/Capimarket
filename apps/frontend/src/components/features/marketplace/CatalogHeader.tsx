import React from "react";
import { Filter } from "lucide-react";

interface CatalogHeaderProps {
  searchType: "products" | "stores" | string;
  activeStore?: unknown;
  sortOrder: string;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  dispatch: (action: { type: string; payload: { key: string; value: unknown } }) => void;
}

export default function CatalogHeader({
  searchType,
  activeStore,
  sortOrder,
  showFilters,
  setShowFilters,
  dispatch,
}: CatalogHeaderProps) {
  return (
    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 sm:mb-8 pb-1 transition-all">
      <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
        {searchType === "stores" && !activeStore
          ? "Directorio de Tiendas"
          : "Catálogo de Productos"}
      </h2>

      {searchType === "products" && (
        <div className="flex items-center gap-2">
          {/* Sort Order Selector */}
          <select
            value={sortOrder}
            onChange={(e) =>
              dispatch({
                type: "SET_FILTER",
                payload: { key: "sortOrder", value: e.target.value },
              })
            }
            className="text-xs sm:text-sm font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 outline-none cursor-pointer text-slate-700 shadow-xs hover:border-slate-300 transition-colors"
          >
            <option value="">⏱ Más recientes</option>
            <option value="price">💰 Precio: menor a mayor</option>
            <option value="-price">💰 Precio: mayor a menor</option>
            <option value="name">🔤 Nombre A-Z</option>
          </select>

          {/* Toggle Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium transition-colors px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg cursor-pointer ${
              showFilters
                ? "bg-slate-100 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filtros
          </button>
        </div>
      )}
    </div>
  );
}