import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, X } from 'lucide-react';
import pb from '../../lib/pocketbase';
import { getImageUrl } from '../../lib/utils';
import useCategories from '../../hooks/useCategories';

export default function ProductFormModal({ product, selectedStoreId, onClose, onSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const { categories } = useCategories();
  
  // Images state
  const [newProductImages, setNewProductImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    return () => {
      newProductImages.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [newProductImages]);

  const handleAddImages = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setNewProductImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    setNewProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formElement = e.target;
    const fd = new FormData(formElement);

    // LÓGICA FINANCIERA: Convertir a centavos
    const priceFloat = parseFloat(fd.get('price'));
    if (!isNaN(priceFloat)) {
      const priceInCents = Math.round(priceFloat * 100);
      fd.set('price', priceInCents);
    }

    fd.append('store', selectedStoreId);
    fd.delete('images');
    
    if (newProductImages.length > 0) {
      newProductImages.forEach(img => fd.append('images', img.file));
    }

    if (product && imagesToDelete.length > 0) {
      imagesToDelete.forEach(filename => fd.append('images-', filename));
    }

    try {
      if (product) {
        await pb.collection('products').update(product.id, fd);
        toast.success('¡Publicación actualizada!');
      } else {
        await pb.collection('products').create(fd);
        toast.success('Producto publicado en CapiMercado.');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar el producto.');
    } finally {
      setIsUploading(false);
    }
  };

  const isModal = !!onClose; // if onClose is provided, it acts as modal

  const content = (
    <div className={`bg-white ${isModal ? 'rounded-[32px] p-8 md:p-10 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100' : 'rounded-[32px] p-8 border border-slate-100 max-w-4xl mx-auto md:p-12 shadow-premium animate-in fade-in duration-300'}`}>
      {isModal && <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>}
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
          {product ? <Edit2 size={24} /> : <Plus size={24} />}
        </div>
        <h3 className="font-extrabold text-2xl tracking-tight text-slate-900">{product ? 'Editar Publicación' : 'Nuevo Artículo'}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Nombre del Producto</label>
            <input name="name" type="text" defaultValue={product?.name} required placeholder="Ej: iPhone 16 Pro" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Precio (USDT)</label>
            <input name="price" type="number" step="0.01" defaultValue={product ? (product.price / 100).toFixed(2) : ''} required placeholder="999.99" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Categoría</label>
            <select name="category" defaultValue={product?.category || ''} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
              <option value="" disabled>Selecciona...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Marca (Opcional)</label>
            <input name="brand" type="text" defaultValue={product?.brand} placeholder="Ej: Apple" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Condición</label>
            <select name="condition" defaultValue={product?.condition || 'new'} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
              <option value="new">✨ Nuevo</option>
              <option value="open_box">📂 Open Box</option>
              <option value="used">📦 Usado</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Stock</label>
            <select name="stock" defaultValue={product?.stock || 'available'} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
              <option value="available">✅ Disponible</option>
              <option value="out_of_stock">❌ Agotado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción Detallada</label>
          <textarea name="description" rows="3" defaultValue={product?.description} placeholder="Especificaciones, lo que incluye en la caja..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
        </div>

        <div>
          {/* Fotos Actuales */}
          {product && product.images && product.images.length > 0 && (
            <div className="mb-5">
              <label className="text-xs font-bold text-slate-500 mb-3 block">
                Fotos actuales ({product.images.length - imagesToDelete.length} activas)
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2.5">
                {product.images.map((filename) => {
                  const isMarked = imagesToDelete.includes(filename);
                  return (
                    <div key={filename} className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${isMarked ? 'opacity-30 grayscale border-red-300' : 'border-slate-100 hover:border-slate-300'}`}>
                      <img src={getImageUrl(product, filename, '200x200')} alt="foto" className="w-full h-full object-cover" />
                      {isMarked ? (
                        <button type="button" onClick={() => setImagesToDelete(prev => prev.filter(f => f !== filename))} className="absolute inset-0 bg-red-400/20 flex items-center justify-center text-red-600 font-extrabold text-[9px] uppercase tracking-widest">Deshacer</button>
                      ) : (
                        <button type="button" onClick={() => setImagesToDelete(prev => [...prev, filename])} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"><X size={11} /></button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nuevas Fotos */}
          <label className="text-xs font-bold text-slate-500 mb-3 block">Agregar fotos</label>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
            {newProductImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 group">
                <img src={img.preview} className="w-full h-full object-cover" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-slate-900 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shadow-md"><X size={12} /></button>
              </div>
            ))}
            <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-emerald-600 transition-all cursor-pointer bg-white">
              <Plus size={24} className="mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Subir Fotos</span>
              <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
            </label>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end">
          {isModal && (
            <button type="button" onClick={onClose} className="px-8 py-4 bg-white text-slate-500 border border-slate-200 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer text-center">
              Cancelar
            </button>
          )}
          <button type="submit" disabled={isUploading} className="px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-premium hover:-translate-y-0.5 text-center">
            {isUploading ? 'Guardando...' : (product ? 'Guardar Cambios' : 'Publicar en CapiMercado')}
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
        {content}
      </div>
    );
  }

  return content;
}
