import React from "react";
import { motion } from "framer-motion";
import { SPRING, getCategoryIcon } from "@/lib/utils";
import type { CategoryRecord } from "@/lib/types/pocketbase";

interface CategoryBentoGridProps {
  onSelectCategory: (categoryName: string) => void;
  categories?: CategoryRecord[];
}

// Estilos visuales por defecto en ciclo para mantener la elegancia del Bento Grid
const CARD_PRESETS = [
  { gradient: "from-slate-900 to-slate-800", textColor: "text-white", badge: "text-slate-400" },
  { gradient: "from-blue-600 to-indigo-700", textColor: "text-white", badge: "text-blue-200" },
  { gradient: "from-emerald-500 to-teal-600", textColor: "text-white", badge: "text-emerald-100" },
  { gradient: "from-amber-500 to-orange-600", textColor: "text-white", badge: "text-amber-100" },
  { gradient: "from-purple-600 to-indigo-600", textColor: "text-white", badge: "text-purple-200" },
  { gradient: "from-slate-100 to-slate-200", textColor: "text-slate-900", badge: "text-slate-500" },
];

export default function CategoryBentoGrid({
  onSelectCategory,
  categories = [],
}: CategoryBentoGridProps) {
  const safeCategories = Array.isArray(categories) ? categories : [];

  if (safeCategories.length === 0) {
    return null;
  }

  return (
    <section className="w-full my-6">
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          ¿Qué buscas hoy?
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[110px] sm:auto-rows-[140px] gap-3 sm:gap-4">
        {safeCategories.map((cat, index) => {
          const Icon = getCategoryIcon(cat.icon);
          const stylePreset = CARD_PRESETS[index % CARD_PRESETS.length];

          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              onClick={() => onSelectCategory(cat.name)}
              className={`col-span-1 row-span-1 bg-linear-to-br ${stylePreset.gradient} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-end text-left overflow-hidden relative group shadow-sm border border-black/5 cursor-pointer`}
            >
              <Icon
                className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${stylePreset.textColor} opacity-15 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300`}
                size={48}
              />

              <div className="z-10 flex flex-col justify-end">
                <span
                  className={`text-base sm:text-2xl font-extrabold tracking-tight ${stylePreset.textColor} leading-tight drop-shadow-xs`}
                >
                  {cat.name}
                </span>

                <span
                  className={`text-[10px] sm:text-xs font-bold mt-1 ${stylePreset.badge} uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform`}
                >
                  Explorar &rarr;
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}