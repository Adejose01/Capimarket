import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '../lib/pocketbase';
import { getImageUrl, formatWhatsAppNumber, SPRING_SLOW } from '../lib/utils';
import PriceDisplay from '../components/PriceDisplay';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const record = await pb.collection('products').getOne(id, {
          expand: 'store,category'
        });
        setProduct(record);
      } catch (error) {
        // Silent catch
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const comprarPorWhatsApp = () => {
    if (!product) return;
    const rawPhone = product.expand?.store?.whatsapp || "";
    const telefono = formatWhatsAppNumber(rawPhone);
    const nombreTienda = product.expand?.store?.name || "Tienda";
    const mensaje = `Hola ${nombreTienda}, me interesa el ${product.name} que vi en CapiMercado por ${(product.price / 100).toFixed(2)} USDT. ¿Sigue disponible?`;
    
    try {
      pb.collection('orders').create({
        product: product.id,
        store: product.expand?.store?.id,
        status: 'pending_whatsapp',
        price_snapshot: product.price
      }).catch(() => {});
    } catch (e) {}

    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => navigate(-1)}></div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-6xl h-[80vh] bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col p-6 lg:p-10"
        >
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
             <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl w-full h-full"></div>
             <div className="flex flex-col gap-6 pt-10">
               <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
               <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
               <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
               <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded w-full mt-8"></div>
             </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={() => navigate(-1)}
      ></motion.div>

      {/* Modal Card - Apple Style */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={SPRING_SLOW}
        className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col no-scrollbar"
      >
        
        {/* Nav Header Sticky */}
        <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} /> Volver
          </button>
          <button onClick={() => navigate(-1)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-white/5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
             <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Lado Izquierdo: Galería de Fotos */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] relative group">
                <img
                  src={getImageUrl(product, product.images?.[imagenSeleccionada], '800x800')}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  onClick={() => window.open(getImageUrl(product, product.images?.[imagenSeleccionada]), '_blank')}
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(product, img, '100x100')}
                      alt={`Miniatura ${idx + 1}`}
                      className={`w-20 h-20 shrink-0 object-cover rounded-xl cursor-pointer border-2 transition-all ${imagenSeleccionada === idx ? 'border-slate-900 opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95'}`}
                      onClick={() => setImagenSeleccionada(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Lado Derecho: Info y Botones */}
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-widest mb-2 items-center gap-1 flex" style={{ color: product.expand?.store?.primaryColor || '#3b82f6' }}>
                {product.expand?.store?.name || 'CapiMercado'}
              </p>
              <h1 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tight leading-tight">{product.name}</h1>
              <div className="mb-8 flex items-baseline gap-2">
                <PriceDisplay amount={product.price} className="scale-125 origin-left" />
                <span className="text-xl text-slate-500 font-bold ml-4">USDT</span>
              </div>

              {/* Condición y Descripción */}
              <div className="mb-8 p-6 bg-slate-50 dark:bg-[#111] rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-1">Condición</p>
                <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 pb-6 border-b border-slate-200 dark:border-white/10">
                  {product.condition === 'new'
                    ? '✨ Nuevo Sellado'
                    : (product.condition === 'open_box' ? '📂 Abierto (Open Box)' : `📦 Usado`)
                  }
                </p>

                <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-2">Descripción</p>
                <div className="text-base text-slate-700 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {product.description || "Sin descripción adicional proporcionada por el vendedor."}
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={comprarPorWhatsApp}
                  disabled={product.stock === 'out_of_stock'}
                  className="w-full bg-[#050505] hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed text-[#FDFBF7] font-bold py-4 px-8 rounded-full shadow-premium flex items-center justify-center gap-3 transition-all duration-300 md:hover:-translate-y-1 active:scale-95 text-lg"
                >
                  <MessageCircle size={24} className="text-brand-green" /> 
                  {product.stock === 'out_of_stock' ? 'Agotado' : 'Comprar vía WhatsApp'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
