import React from "react";

export default function AppliedFilterChips({
  searchType,
  activeCategory,
  minPrice,
  maxPrice,
  filterCond,
  filterLoc,
  debouncedSearchTerm,
  setSearchTerm,
  setDebouncedSearchTerm,
  setFilter,
  resetFilters,
}) {
  const hasActiveFilters =
    activeCategory !== "Todos" ||
    Boolean(minPrice) ||
    Boolean(maxPrice) ||
    filterCond !== "all" ||
    filterLoc !== "all" ||
    Boolean(debouncedSearchTerm);

  if (searchType !== "products" || !hasActiveFilters) return null;

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handleClearAll = () => {
    resetFilters();
    handleClearSearch();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {debouncedSearchTerm && (
        <Chip
          label={`🔍 "${debouncedSearchTerm}"`}
          onClose={handleClearSearch}
        />
      )}

      {activeCategory !== "Todos" && (
        <Chip
          label={`📂 ${activeCategory}`}
          onClose={() => setFilter("activeCategory", "Todos")}
        />
      )}

      {filterCond !== "all" && (
        <Chip
          label={
            filterCond === "new"
              ? "✨ Nuevo"
              : filterCond === "open_box"
                ? "📂 Open Box"
                : "📦 Usado"
          }
          onClose={() => setFilter("filterCond", "all")}
        />
      )}

      {minPrice && (
        <Chip
          label={`Min: $${minPrice}`}
          onClose={() => setFilter("minPrice", "")}
        />
      )}

      {maxPrice && (
        <Chip
          label={`Max: $${maxPrice}`}
          onClose={() => setFilter("maxPrice", "")}
        />
      )}

      {filterLoc !== "all" && (
        <Chip
          label={`📍 ${filterLoc}`}
          onClose={() => setFilter("filterLoc", "all")}
        />
      )}

      <button
        onClick={handleClearAll}
        className="text-xs font-bold text-slate-500 hover:text-red-600 underline ml-1 transition-colors"
      >
        Limpiar todo
      </button>
    </div>
  );
}

// Subcomponente interno para evitar repetir el JSX del Badge
function Chip({ label, onClose }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
      {label}
      <button
        onClick={onClose}
        className="ml-1 hover:text-red-300 transition-colors"
      >
        ✕
      </button>
    </span>
  );
}
