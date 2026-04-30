import React from 'react';
import { motion } from 'framer-motion';
import { SPRING, getCategoryIcon } from '../lib/utils';
import { AnimatePresence } from 'framer-motion';

// ============================================================================
// BENTO BOX CATEGORIAS — Pilar 2
// ============================================================================
// NOTA: Estas etiquetas deben coincidir con el campo "category" de la coleccion
// \"stores\" en PocketBase. MarketplaceView filtra products segun store.category.

export default function CategoryBentoGrid({ onSelectCategory, categories = [] }) {
  const [selectedRoot, setSelectedRoot] = React.useState(null);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const rootCategories = safeCategories.filter(c => !c.parent_id);
  const subCategories = safeCategories.filter(c => c.parent_id === selectedRoot?.id);

  const handleRootClick = (cat) => {
    const children = safeCategories.filter(c => c.parent_id === cat.id);
    if (children.length > 0) {
      if (selectedRoot?.id === cat.id) {
        setSelectedRoot(null);
      } else {
        setSelectedRoot(cat);
      }
    } else {
      onSelectCategory(cat.name);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">¿Qué buscas hoy?</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[100px] sm:auto-rows-[140px] gap-3 sm:gap-4">
        {rootCategories?.map((cat) => {
          const Icon = getCategoryIcon(cat.name);
          const isActive = selectedRoot?.id === cat.id;
          return (
            <motion.button 
              key={cat.id} 
              whileHover={{ scale: 1.02, y: -4 }} 
              whileTap={{ scale: 0.97 }} 
              transition={SPRING} 
              onClick={() => handleRootClick(cat)}
              className={`${cat.span || 'col-span-1 row-span-1'} bg-gradient-to-br ${cat.gradient || 'from-slate-50 to-slate-100'} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-end text-left overflow-hidden relative group shadow-sm border ${isActive ? 'border-slate-900' : 'border-transparent'}`}>
              <Icon className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${cat.textColor || 'text-slate-900'} opacity-10 group-hover:opacity-25 transition-opacity`} size={44} />
              <span className={`text-base sm:text-2xl font-extrabold tracking-tight ${cat.textColor || 'text-slate-900'} leading-none`}>{cat.name}</span>
              <span className={`text-[9px] sm:text-xs font-extrabold mt-1 ${cat.textColor || 'text-slate-900'} opacity-50 uppercase tracking-widest`}>
                {safeCategories.some(c => c.parent_id === cat.id) ? 'Explorar' : 'Ver todo'}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedRoot && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Subcategorías de {selectedRoot.name}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {subCategories.map(sub => (
                  <motion.button
                    key={sub.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(sub.name)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-bold text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm"
                  >
                    {sub.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
