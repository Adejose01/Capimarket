import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import PriceDisplay from './PriceDisplay';
import { SPRING, formatWhatsAppNumber } from '../lib/utils';
import OptimizedImage from './OptimizedImage';

// ============================================================================
// PRODUCT CARD — Componente reutilizable de tarjeta de producto
// ============================================================================
export default function ProductCard({ 
  product, 
  activeStoreName, 
  storeBrandColor, 
  mainImage, 
  getImageUrl, 
  displayCondition, 
  isOutOfStock,
  priority = false, // Nuevo prop para LCP
  onSelectProduct // if they ever use it
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const comprarPorWhatsAppRapido = (e, producto) => {
    e.stopPropagation();
    const rawPhone = producto.expand?.store?.whatsapp || "";
    const telefono = formatWhatsAppNumber(rawPhone);
    const mensaje = `Hola! Me interesa el producto: ${producto.name}. Aún está disponible?`;
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.05 }} 
      transition={SPRING} 
      className={`transform-gpu h-full w-full group bg-white dark:bg-[#0a0a0a] rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-card-hover flex flex-col cursor-pointer overflow-hidden ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
      onClick={() => navigate(`/producto/${product.id}`, { state: { background: location } })}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-[#111] p-6 flex flex-col items-center justify-center">
        {mainImage ? (
           <OptimizedImage 
              src={getImageUrl(product, mainImage, '400x500')} 
              alt={product.name} 
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="w-[90%] h-[90%] object-contain high-quality-rendering group-hover:scale-105 transition-transform duration-700 mix-blend-multiply dark:mix-blend-normal"
           />
        ) : (
           <div className="w-[90%] h-[90%] flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-xl text-slate-400">Sin Imagen</div>
        )}
        
        {/* Etiqueta de Agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200/50 dark:border-white/10 text-slate-900 dark:text-white font-extrabold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full uppercase tracking-widest text-[9px] sm:text-[10px] shadow-sm">Agotado</span>
          </div>
        )}

        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2 items-end z-30">
          <span className="text-[8px] sm:text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest bg-white/90 dark:bg-[#1a1a1a]/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-white/10 max-w-[90px] truncate">
            {activeStoreName ? activeStoreName : (product.expand?.store?.name || 'Stock')}
          </span>
          {displayCondition && (
            <span className="text-[8px] sm:text-[9px] font-extrabold px-2 py-1 rounded-full uppercase tracking-widest bg-white/90 dark:bg-[#1a1a1a]/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-white/10 hidden xs:block">
              {displayCondition}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col z-10 bg-white dark:bg-[#0a0a0a]">
        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1 sm:mb-2 text-slate-500 truncate">
          {product.brand || 'Tech'} • <span style={{ color: storeBrandColor }}>{product.expand?.store?.name || 'CapiMercado'}</span>
        </p>
        <h3 className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight tracking-tight">{product.name}</h3>
        
        <div className="flex items-end justify-between mt-auto pt-3 sm:pt-4 border-t border-slate-50 dark:border-white/5">
          <PriceDisplay amount={product.price} />
          
          <button 
             onClick={(e) => comprarPorWhatsAppRapido(e, product)}
             disabled={isOutOfStock}
             className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-2 sm:p-2.5 rounded-full transition-all shadow-sm hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-1 group/btn"
          >
             <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:text-luxury-green transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
