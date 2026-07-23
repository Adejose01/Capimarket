import React from "react";
import { ChevronRight } from "lucide-react";
import SafeImage from "@/components/common/SafeImage";
import { getImageUrl, getCategoryIcon } from "@/lib/utils";

export default function StoreCard({ store, categories, onClick }) {
  // Procesamos las categorías de la tienda de forma limpia
  const storeCatIds = Array.isArray(store.category)
    ? store.category
    : store.category
      ? [store.category]
      : [];

  return (
    <div
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex items-center gap-6 relative overflow-hidden"
    >
      {/* Accent Line */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2.5"
        style={{
          backgroundColor: store.primaryColor || "#0f172a",
        }}
      />

      {/* Logo */}
      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black bg-slate-50 text-slate-900 overflow-hidden z-10 border border-slate-100">
        {store.logo ? (
          <SafeImage
            src={getImageUrl(store, store.logo, "100x100")}
            alt={store.name}
            className="w-full h-full"
          />
        ) : (
          store.name.charAt(0)
        )}
      </div>

      {/* Content */}
      <div className="z-10 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h5 className="font-bold text-lg text-slate-900 tracking-tight leading-none">
            {store.name}
          </h5>
          {store.verified && (
            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-extrabold uppercase">
              ✓
            </span>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {storeCatIds.length === 0 ? (
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
              Sin categoría
            </span>
          ) : (
            storeCatIds.slice(0, 3).map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              const Icon = getCategoryIcon(cat.name);
              return (
                <span
                  key={catId}
                  className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Icon size={10} /> {cat.name}
                </span>
              );
            })
          )}

          {store.location && (
            <span className="text-xs font-medium text-slate-400">
              • {store.location}
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="ml-auto text-slate-300 group-hover:text-slate-900 transition-colors group-hover:translate-x-1 z-10" />
    </div>
  );
}
