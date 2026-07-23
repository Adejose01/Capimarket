import React from "react";

export default function FilterPanel({
  minPrice,
  maxPrice,
  filterCond,
  filterLoc,
  availableLocations = [],
  setFilter,
  resetFilters,
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-4 sm:mb-8 animate-in slide-in-from-top-2 duration-300">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
        <div>
          <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">
            Precio Mín.
          </label>
          <input
            type="number"
            placeholder="$0"
            value={minPrice}
            onChange={(e) => setFilter("minPrice", e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">
            Precio Máx.
          </label>
          <input
            type="number"
            placeholder="$9999"
            value={maxPrice}
            onChange={(e) => setFilter("maxPrice", e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">
            Condición
          </label>
          <select
            value={filterCond}
            onChange={(e) => setFilter("filterCond", e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            <option value="all">Cualquiera</option>
            <option value="new">✨ Nuevo</option>
            <option value="open_box">📂 Open Box</option>
            <option value="used">📦 Usado</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">
            Ubicación
          </label>
          <select
            value={filterLoc}
            onChange={(e) => setFilter("filterLoc", e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
          >
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc === "all" ? "Todas" : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-2 sm:mt-4 flex justify-end">
        {/* Ejecuta la acción única del Reducer */}
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
