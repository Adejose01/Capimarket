import React from "react";
import StoreCard from "./StoreCard";

export default function StoreGrid({
  stores = [],
  categories = [],
  activeCategory,
  onResetCategory,
  onSelectStore,
}) {
  return (
    <div className="space-y-6">
      {/* Category Indicator */}
      {activeCategory !== "Todos" && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Mostrando tiendas de:</span>
          <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold">
            {activeCategory}
          </span>
          <button
            onClick={onResetCategory}
            className="text-xs underline hover:text-slate-900"
          >
            Ver todas
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((s) => (
          <StoreCard
            key={s.id}
            store={s}
            categories={categories}
            onClick={() => onSelectStore(s.slug || s.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {stores.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg font-bold text-slate-400">
            No se encontraron tiendas
            {activeCategory !== "Todos"
              ? ` en la categoría "${activeCategory}"`
              : ""}
            .
          </p>
        </div>
      )}
    </div>
  );
}
