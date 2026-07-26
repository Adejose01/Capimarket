import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryRecord } from "@/lib/types/pocketbase";

interface CategoryBarProps {
  /** Puede recibir un array de CategoryRecord o un array de strings (nombres) */
  availableCategories?: CategoryRecord[] | string[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export default function CategoryBar({
  availableCategories = [],
  activeCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  // Normalizamos las categorías para obtener siempre el ID y el Nombre
  const categoriesList = availableCategories.map((cat, index) => {
    if (typeof cat === "string") {
      return { id: `cat-${index}-${cat}`, name: cat };
    }
    return { id: cat.id, name: cat.name };
  });

  // Comprueba la posición del scroll para mostrar u ocultar los degradados laterales
  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Margen de tolerancia de 5px para evitar destellos
    setShowLeftFade(scrollLeft > 5);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [availableCategories]);

  // Manejador de scroll con flechas
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === "left" ? -280 : 280;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (categoriesList.length === 0) return null;

  return (
    <section className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-xs mb-8 sm:mb-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative group">
        
        {/* Degradado e Icono de Scroll Izquierdo */}
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-16 flex items-center justify-start pl-2 bg-linear-to-r from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Desplazar a la izquierda"
              className="pointer-events-auto p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/* Contenedor con Scroll Horizontal (px-4 extra para rango respirable) */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-2 sm:gap-3 overflow-x-auto py-3 sm:py-4 px-2 sm:px-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.name;

            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                onClick={() => onSelectCategory(cat.name)}
                className={`whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.name}
              </motion.button>
            );
          })}
        </div>

        {/* Degradado e Icono de Scroll Derecho */}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-16 flex items-center justify-end pr-2 bg-linear-to-l from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 to-transparent pointer-events-none">
            <button
              onClick={() => handleScroll("right")}
              aria-label="Desplazar a la derecha"
              className="pointer-events-auto p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}