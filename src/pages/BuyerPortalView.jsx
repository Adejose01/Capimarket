import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Store, Lock, ChevronRight, LogOut, ArrowLeft, X,
  Settings
} from 'lucide-react';
import pb from '../lib/pocketbase';
import useAuthStore from '../store/useAuthStore';

export default function BuyerPortalView() {
  const [myStores, setMyStores] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) { navigate('/auth'); return; }
    pb.collection('stores').getFullList({ filter: `owner = "${user.id}"` })
      .then(setMyStores).catch(() => setMyStores([]));
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated || !user) return null;

  const handleApplyToSell = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    if (name) {
      const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      fd.append('slug', slug);
    }
    fd.append('status', 'pending');
    fd.append('owner', user.id);
    try {
      await pb.collection('stores').create(fd);
      toast.success('¡Solicitud enviada con éxito! El equipo de CapiMercado se contactará contigo pronto.');
      setShowApplyModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error enviando tu solicitud.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-200 flex flex-col">
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Conviértete en Aliado</h3>
            <p className="text-slate-500 text-sm mb-6">Completa tus datos y te contactaremos para verificar tu tienda.</p>
            <form onSubmit={handleApplyToSell} className="space-y-4">
              <div><label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">Nombre de tu Tienda</label>
              <input name="name" type="text" required placeholder="Ej: TechStore C.A." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" /></div>
              <div><label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">Usuario en Instagram</label>
              <input name="instagram" type="text" placeholder="@tutienda" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">WhatsApp</label>
                <input name="whatsapp" type="text" required placeholder="58414..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" /></div>
                <div><label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">Correo</label>
                <input name="email" type="email" required placeholder="tu@correo.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" /></div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 transition-colors shadow-lg">Enviar Solicitud</button>
            </form>
          </div>
        </div>
      )}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
              <ArrowLeft className="text-slate-400 hover:text-slate-900 transition-colors" />
              <span className="font-bold tracking-tight">Volver a Tienda</span>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-xl">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </nav>
      <main className="pt-24 pb-12 flex-grow max-w-3xl mx-auto w-full px-4">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{user.name || 'Usuario CapiMercado'}</h1>
            <p className="text-sm font-medium text-slate-500">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white text-xs font-bold uppercase tracking-wider text-slate-800 rounded-md border border-slate-200">Cuenta Comprador</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors cursor-pointer group flex items-center justify-between">
            <div><h3 className="font-bold text-slate-900 flex items-center gap-2"><Lock size={16} /> Seguridad y Contraseña</h3>
            <p className="text-sm text-slate-500 mt-1">Actualiza tus credenciales de acceso</p></div>
            <ChevronRight className="text-slate-300 group-hover:text-slate-900 transition-colors px-2" />
          </div>
          {myStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => navigate('/panel')} className="p-6 border border-slate-900 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center gap-3">
                <Settings size={28} className="text-slate-900 group-hover:rotate-90 transition-transform duration-500" />
                <h3 className="font-bold text-slate-900">Administrar mis Tiendas</h3>
                <p className="text-xs text-slate-500">Ingresa al panel de control de tus negocios actuales.</p>
              </button>
              <button onClick={() => setShowApplyModal(true)} className="p-6 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center gap-3">
                <Store className="text-slate-400 w-8 h-8 group-hover:text-slate-600 transition-colors" />
                <h3 className="font-bold text-slate-900">Crear nueva Tienda</h3>
                <p className="text-xs text-slate-500">Solicita abrir otra sucursal u otra marca.</p>
              </button>
            </div>
          ) : (
            <div className="p-6 border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center bg-slate-50 gap-3 hover:border-slate-300 transition-colors cursor-pointer" onClick={() => setShowApplyModal(true)}>
              <Store className="text-slate-300 w-8 h-8" />
              <p className="font-bold text-slate-700">Crear mi Tienda / Quiero Vender</p>
              <p className="text-xs text-slate-500 max-w-sm mb-2">Si eres una tienda de tecnología y deseas publicar aquí, envía tu solicitud.</p>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">Aplicar para Vender</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
