import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function CategoryBar({
  availableCategories = [],
  activeCategory,
  onSelectCategory,
}) {
  return (
    <section className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm mb-8 sm:mb-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar py-3 sm:py-4">
        <div className="flex gap-2 sm:gap-3">
          {availableCategories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 ${
                activeCategory === cat
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
