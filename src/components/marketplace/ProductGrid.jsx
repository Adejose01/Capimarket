import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';

export default function ProductGrid({ products, isLoading, activeStoreName, getImageUrl, onSelectProduct, currentPage, totalPages, setPage }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8 mt-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse flex flex-col p-4 border border-slate-200/50 dark:border-white/5">
             <div className="w-full aspect-square bg-slate-200 dark:bg-slate-700/50 rounded-2xl mb-4"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded-full w-3/4 mb-2 mt-auto"></div>
             <div className="h-6 bg-slate-200 dark:bg-slate-700/50 rounded-full w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron resultados</h3>
        <p className="text-slate-500 font-medium max-w-sm">No encontramos artículos que coincidan con tu búsqueda y filtros actuales.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div>
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8 mt-4"
      >
        {products.map((p) => {
          const storeBrandColor = p.expand?.store?.primaryColor || '#0f172a';
          const mainImage = p.images?.length > 0 ? p.images[0] : null;
          const displayCondition = p.condition === 'new' ? '✨ Nuevo' : (p.condition === 'open_box' ? '📂 Open Box' : '📦 Usado');
          const isOutOfStock = p.stock === 'out_of_stock';
          
          return (
            <motion.div key={p.id} variants={itemVariants} className="flex h-full group">
              <ProductCard
                product={p}
                activeStoreName={activeStoreName}
                storeBrandColor={storeBrandColor}
                mainImage={mainImage}
                getImageUrl={getImageUrl}
                displayCondition={displayCondition}
                isOutOfStock={isOutOfStock}
                onSelectProduct={(prod) => onSelectProduct(prod)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-bold text-sm"
          >
            Anterior
          </button>
          <span className="text-sm font-bold text-slate-500">Página {currentPage} de {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 font-bold text-sm"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
