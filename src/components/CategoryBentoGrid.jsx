import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Headphones, Package } from 'lucide-react';
import { SPRING } from '../lib/utils';

// ============================================================================
// BENTO BOX CATEGORIAS — Pilar 2
// ============================================================================
const CATEGORY_BENTO = [
  { label: 'Smartphones', icon: Smartphone, span: 'col-span-2 row-span-2', gradient: 'from-slate-900 to-slate-700', text: 'text-white' },
  { label: 'Laptops', icon: Laptop, span: 'col-span-1 row-span-1', gradient: 'from-indigo-50 to-indigo-100', text: 'text-indigo-900' },
  { label: 'Audio', icon: Headphones, span: 'col-span-1 row-span-1', gradient: 'from-emerald-50 to-emerald-100', text: 'text-emerald-900' },
  { label: 'Accesorios', icon: Package, span: 'col-span-2 row-span-1', gradient: 'from-amber-50 to-orange-100', text: 'text-amber-900' },
];
// NOTA: Estas etiquetas deben coincidir con el campo "category" de la coleccion
// "stores" en PocketBase. MarketplaceView filtra products segun store.category.

export default function CategoryBentoGrid({ onSelectCategory, categories }) {
  // Use dynamic categories from DB, fallback to CATEGORY_BENTO if empty
  const displayCategories = (categories && categories.length > 0)
    ? categories.map(cat => {
        const fallback = CATEGORY_BENTO.find(b => b.label.toLowerCase() === cat.name.toLowerCase()) || { gradient: 'from-slate-100 to-slate-200', text: 'text-slate-900', icon: Package };
        return {
          label: cat.name,
          icon: fallback.icon,
          span: cat.span || 'col-span-1 row-span-1',
          gradient: cat.gradient || fallback.gradient,
          text: cat.textColor || fallback.text
        };
      })
    : CATEGORY_BENTO;

  return (
    <section>
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Por categoría</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 auto-rows-[90px] sm:auto-rows-[120px] gap-2.5 sm:gap-4">
        {displayCategories?.map(({ label, icon: Icon, span, gradient, text }) => (
          <motion.button key={label} whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.97 }} transition={SPRING} onClick={() => onSelectCategory(label)}
            className={`${span} bg-gradient-to-br ${gradient} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-end text-left overflow-hidden relative group shadow-sm`}>
            <Icon className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${text} opacity-10 group-hover:opacity-25 transition-opacity`} size={44} />
            <span className={`text-base sm:text-2xl font-extrabold tracking-tight ${text} leading-none`}>{label}</span>
            <span className={`text-[9px] sm:text-xs font-extrabold mt-1 ${text} opacity-50 uppercase tracking-widest`}>Ver todo</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
