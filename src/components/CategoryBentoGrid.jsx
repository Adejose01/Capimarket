import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING, getCategoryIcon } from '../lib/utils';

// ============================================================================
// BENTO BOX CATEGORIAS — Con subcategorías inline bajo la categoría seleccionada
// ============================================================================

export default function CategoryBentoGrid({ onSelectCategory, categories = [] }) {
  const [selectedRoot, setSelectedRoot] = React.useState(null);

  const safeCategories = Array.isArray(categories) ? categories : [];
  const rootCategories = safeCategories.filter(c => !c.parent_id);

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

  // Determine grid layout: 2 columns on mobile, 4 on desktop
  // We need to figure out which row the selected category is in so we can insert subcats after that row
  const cols = typeof window !== 'undefined' && window.innerWidth >= 640 ? 4 : 2;

  // Find the index of the selected root in rootCategories
  const selectedIndex = selectedRoot ? rootCategories.findIndex(c => c.id === selectedRoot.id) : -1;
  // The subcats should appear after the row containing the selected item
  // Row index: Math.floor(selectedIndex / cols) => insert after index: (rowIndex + 1) * cols - 1
  const insertAfterIndex = selectedIndex >= 0 ? (Math.floor(selectedIndex / cols) + 1) * cols - 1 : -1;

  // Build the render list: category cards with subcategory panel inserted at the right spot
  const renderItems = [];
  rootCategories.forEach((cat, index) => {
    renderItems.push({ type: 'category', cat, index });
    
    if (index === insertAfterIndex || (index === rootCategories.length - 1 && selectedIndex >= 0 && insertAfterIndex >= rootCategories.length)) {
      renderItems.push({ type: 'subcategories', parentCat: selectedRoot });
    }
  });

  // If insertAfterIndex is beyond the array (e.g. last row is incomplete)
  if (selectedIndex >= 0 && !renderItems.some(item => item.type === 'subcategories')) {
    renderItems.push({ type: 'subcategories', parentCat: selectedRoot });
  }

  const subCategoriesFor = (parentId) => safeCategories.filter(c => c.parent_id === parentId);

  return (
    <section>
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">¿Qué buscas hoy?</h2>
      </div>
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Render rows manually to insert subcategory panel at the correct position */}
        {(() => {
          const rows = [];
          let currentRow = [];
          
          for (const item of renderItems) {
            if (item.type === 'category') {
              currentRow.push(item);
              
              // Check if we need to flush the row
              if (currentRow.length === cols) {
                rows.push({ type: 'categoryRow', items: [...currentRow] });
                currentRow = [];
              }
            } else if (item.type === 'subcategories') {
              // Flush any remaining categories in current row first
              if (currentRow.length > 0) {
                rows.push({ type: 'categoryRow', items: [...currentRow] });
                currentRow = [];
              }
              rows.push(item);
            }
          }
          
          // Flush remaining
          if (currentRow.length > 0) {
            rows.push({ type: 'categoryRow', items: [...currentRow] });
          }

          return rows.map((row, rowIndex) => {
            if (row.type === 'categoryRow') {
              return (
                <div key={`row-${rowIndex}`} className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[100px] sm:auto-rows-[140px] gap-3 sm:gap-4">
                  {row.items.map(({ cat }) => {
                    const Icon = getCategoryIcon(cat.name);
                    const isActive = selectedRoot?.id === cat.id;
                    return (
                      <motion.button 
                        key={cat.id} 
                        whileHover={{ scale: 1.02, y: -4 }} 
                        whileTap={{ scale: 0.97 }} 
                        transition={SPRING} 
                        onClick={() => handleRootClick(cat)}
                        className={`col-span-1 row-span-1 bg-gradient-to-br ${cat.gradient || 'from-slate-50 to-slate-100'} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-end text-left overflow-hidden relative group shadow-sm border-2 transition-all duration-200 ${isActive ? 'border-white ring-2 ring-slate-900 shadow-lg' : 'border-transparent'}`}
                      >
                        <Icon className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${cat.textColor || 'text-slate-900'} opacity-10 group-hover:opacity-25 transition-opacity`} size={44} />
                        <span className={`text-base sm:text-2xl font-extrabold tracking-tight ${cat.textColor || 'text-slate-900'} leading-none`}>{cat.name}</span>
                        <span className={`text-[9px] sm:text-xs font-extrabold mt-1 ${cat.textColor || 'text-slate-900'} opacity-50 uppercase tracking-widest`}>
                          {safeCategories.some(c => c.parent_id === cat.id) ? (isActive ? '▾ Cerrar' : '▸ Explorar') : 'Ver todo'}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              );
            } else if (row.type === 'subcategories' && row.parentCat) {
              const subs = subCategoriesFor(row.parentCat.id);
              return (
                <AnimatePresence key="subcats-panel" mode="wait">
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-inner">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Subcategorías de {row.parentCat.name}</p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {/* Button to see ALL in this parent category */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onSelectCategory(row.parentCat.name)}
                          className="px-4 py-2 bg-slate-900 text-white border border-slate-900 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm"
                        >
                          Ver todo {row.parentCat.name}
                        </motion.button>
                        {subs.map(sub => (
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
                </AnimatePresence>
              );
            }
            return null;
          });
        })()}
      </div>
    </section>
  );
}
