import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Palette, MessageCircle, Smartphone } from 'lucide-react';
import pb from '../../lib/pocketbase';
import { getImageUrl } from '../../lib/utils';
import SafeImage from '../SafeImage';

export default function BrandSettings({ selectedStore, onUpdateSuccess }) {
  const [isUpdatingBrand, setIsUpdatingBrand] = useState(false);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    return () => {
      if (previewBanner) URL.revokeObjectURL(previewBanner);
      if (previewLogo) URL.revokeObjectURL(previewLogo);
    };
  }, [previewBanner, previewLogo]);

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    setIsUpdatingBrand(true);
    const formElement = e.target;
    const fd = new FormData(formElement);

    try {
      const updatedStore = await pb.collection('stores').update(selectedStore.id, fd);
      toast.success('¡Tienda actualizada!');
      onUpdateSuccess(updatedStore);
      setPreviewBanner(null);
      setPreviewLogo(null);
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar la marca.');
    } finally {
      setIsUpdatingBrand(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 max-w-4xl mx-auto animate-in fade-in duration-300 shadow-premium">
      <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
          <Palette size={24} />
        </div>
        Personaliza tu Identidad Visual
      </h3>

      <form onSubmit={handleUpdateBrand} className="space-y-8">
        <div>
          <label className="text-xs font-bold text-slate-500 mb-3 block">Banner Principal de la Tienda (Proporción 16:9)</label>
          {(previewBanner || selectedStore.banner) && (
            <div className="mb-4 rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[3/1] relative border border-slate-100 bg-slate-50 shadow-sm">
              {previewBanner ? (
                <img src={previewBanner} alt="Banner Preview" className="w-full h-full object-cover" />
              ) : (
                <SafeImage src={getImageUrl(selectedStore, selectedStore.banner, '1200x400')} alt="Banner" className="w-full h-full object-cover" />
              )}
            </div>
          )}
          <input name="banner" type="file" accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPreviewBanner(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-4 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">Logo Oficial</label>
            <div className="flex items-center gap-4">
              {(previewLogo || selectedStore.logo) && (
                previewLogo ? (
                  <img src={previewLogo} alt="Logo Preview" className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 object-cover shadow-sm" />
                ) : (
                  <SafeImage src={getImageUrl(selectedStore, selectedStore.logo, '100x100')} alt="Logo" className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 object-cover shadow-sm" />
                )
              )}
              <input name="logo" type="file" accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full p-2 pr-6 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10 transition-all shadow-sm">
            <input
              name="primaryColor"
              type="color"
              defaultValue={selectedStore.primaryColor || "#0f172a"}
              className="w-12 h-12 rounded-full border-0 cursor-pointer bg-transparent overflow-hidden"
            />
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block">Color de Marca</label>
              <span className="text-sm font-mono text-slate-400">HEX Code</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-500 mb-2 block">Sede o Ubicación (Para filtros)</label>
            <input name="location" type="text" defaultValue={selectedStore.location} placeholder="Ej: Valencia, Sambil" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-500 mb-2 block">URL de Google Maps (Opcional)</label>
            <input name="maps_url" type="url" defaultValue={selectedStore.maps_url} placeholder="https://maps.app.goo.gl/..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción de la Marca (Bio)</label>
            <textarea name="description" defaultValue={selectedStore.description} rows="3" placeholder="Somos distribuidores oficiales..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><MessageCircle size={16} className="text-emerald-600" /> WhatsApp Manager</label>
            <input name="whatsapp" type="text" defaultValue={selectedStore.whatsapp} placeholder="Ej: 58414..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">Instagram</label>
            <input name="instagram" type="text" defaultValue={selectedStore.instagram} placeholder="@tutienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><Smartphone size={16} className="text-slate-800" /> TikTok</label>
            <input name="tiktok" type="text" defaultValue={selectedStore.tiktok} placeholder="@tutienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">Facebook</label>
            <input name="facebook" type="text" defaultValue={selectedStore.facebook} placeholder="URL o Usuario" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm" />
          </div>
        </div>

        <button type="submit" disabled={isUpdatingBrand} className="w-full bg-slate-900 text-white py-5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all mt-8 shadow-premium disabled:opacity-50 hover:-translate-y-0.5">
          {isUpdatingBrand ? 'Guardando Cambios...' : 'Guardar y Actualizar Marca'}
        </button>
      </form>
    </div>
  );
}
