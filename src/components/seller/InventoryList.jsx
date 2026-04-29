import React from 'react';
import { Package, Edit2, Trash2 } from 'lucide-react';
import SafeImage from '../SafeImage';
import { getImageUrl } from '../../lib/utils';
import pb from '../../lib/pocketbase';

export default function InventoryList({ inventory, setEditingProduct, setView, selectedStoreId, reloadInventory }) {
  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto definitivamente?')) {
      await pb.collection('products').delete(id);
      reloadInventory(selectedStoreId);
    }
  };

  return (
    <div className="animate-in fade-in duration-300 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-extrabold text-2xl tracking-tighter text-slate-900 flex items-center gap-3">
          <Package className="text-slate-400" /> Inventario Activo <span className="text-xs font-bold text-emerald-600 bg-emerald-600/10 px-3 py-1 rounded-full">{inventory.length}</span>
        </h3>
      </div>

      {inventory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory?.map(p => {
            const mainImage = p.images && p.images.length > 0 ? p.images[0] : null;
            // Mostrar precio devuelto de centavos a float
            const displayPrice = (p.price / 100).toFixed(2);
            
            return (
              <div key={p.id} className={`bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 group transition-all shadow-sm hover:shadow-premium hover:-translate-y-1 ${p.stock === 'out_of_stock' ? 'opacity-60 grayscale' : ''}`}>
                <div className="relative shrink-0">
                  <SafeImage
                    src={getImageUrl(p, mainImage, '100x100')}
                    alt={p.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 object-cover"
                  />
                  {p.images && p.images.length > 1 && (
                    <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg">+{p.images.length - 1}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base md:text-lg leading-tight truncate text-slate-900">{p.name}</h4>
                  <p className="text-slate-900 font-extrabold tracking-tight mt-1">{displayPrice} <span className="text-[10px] font-medium text-slate-500">USDT</span></p>
                  <div className="flex items-center gap-2 mt-2 max-w-full overflow-hidden">
                    {p.condition && <span className="text-[9px] uppercase tracking-widest bg-slate-100 px-2 py-1 flex-shrink-0 rounded-md text-slate-600 font-semibold">{p.condition === 'new' ? '✨ Nuevo' : (p.condition === 'open_box' ? '📂 Open Box' : '📦 Usado')}</span>}
                    {p.stock === 'out_of_stock' && <span className="text-[9px] uppercase tracking-widest bg-red-50 text-red-500 px-2 py-1 rounded-md font-bold flex-shrink-0">❌ Agotado</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => setEditingProduct(p)} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-white text-slate-400">
          <Package size={48} className="mb-4 opacity-50 text-slate-300" />
          <p className="font-bold text-sm mb-6 max-w-sm text-slate-500">Aún no tienes artículos en tu inventario. ¡Publica el primero para ver tus métricas!</p>
          <button onClick={() => setView('create')} className="px-8 py-3 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-colors shadow-premium flex items-center gap-2 hover:-translate-y-0.5">
            <Edit2 size={16} /> Publicar Producto
          </button>
        </div>
      )}
    </div>
  );
}
