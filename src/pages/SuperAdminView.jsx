import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShieldAlert, Store, ArrowLeft, Trash2, Activity, TrendingUp } from 'lucide-react';
import pb from '../lib/pocketbase';
import { getImageUrl } from '../lib/utils';
import SafeImage from '../components/SafeImage';

export default function SuperAdminView() {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { pb.collection('stores').getFullList().then(setStores); }, []);

  const handleApproveStore = async (id) => {
    if (window.confirm('¿Aprobar esta tienda y generar ID Secreto?')) {
      try {
        await pb.collection('stores').update(id, { status: 'approved' });
        pb.collection('stores').getFullList().then(setStores);
        toast.success('Tienda aprobada. El ID Secreto ya está activo.');
      } catch (error) { console.error(error); toast.error('Error al aprobar la tienda.'); }
    }
  };

  const handleToggleStoreStatus = async (store) => {
    const newStatus = store.status === 'approved' ? 'suspended' : 'approved';
    const actionName = newStatus === 'approved' ? 'Reactivar' : 'Suspender';
    if (window.confirm(`¿Seguro que deseas ${actionName} esta tienda?`)) {
      try {
        await pb.collection('stores').update(store.id, { status: newStatus });
        pb.collection('stores').getFullList().then(setStores);
      } catch (error) { console.error(error); }
    }
  };

  const handleRejectStore = async (id) => {
    if (window.confirm('¿Rechazar y eliminar esta solicitud permanentemente?')) {
      try {
        await pb.collection('stores').delete(id);
        pb.collection('stores').getFullList().then(setStores);
      } catch (error) { console.error(error); }
    }
  };

  const pendingStores = stores.filter(s => s.status === 'pending');
  const activeStores = stores.filter(s => s.status !== 'pending');

  return (
    <div className="min-h-screen bg-[#050505] text-[#FDFBF7] p-6 md:p-12 font-sans selection:bg-indigo-500">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <ShieldAlert className="text-red-500" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-1">NÚCLEO MAESTRO</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Acceso Privado ADJML</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="self-start md:self-auto flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            <ArrowLeft size={14} /> Volver al Home
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12">
          <div className="space-y-8">
            <div className="bg-[#111] rounded-[40px] p-8 border border-white/5 shadow-2xl">
              <h3 className="font-extrabold text-xl tracking-tighter uppercase mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3"><Store className="text-slate-400" /> Solicitudes Pendientes</div>
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">{pendingStores.length}</span>
              </h3>
              {pendingStores.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-3xl">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Sin solicitudes nuevas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingStores.map(s => (
                    <div key={s.id} className="bg-black border border-white/10 p-5 rounded-3xl group transition-all hover:border-slate-500/50">
                      <h4 className="font-bold text-white mb-1 uppercase tracking-tight">{s.name}</h4>
                      <p className="text-[10px] text-white/50 mb-5 font-mono uppercase tracking-widest">WA: {s.whatsapp}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveStore(s.id)} className="flex-1 bg-green-500 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-colors">Aprobar Tienda</button>
                        <button onClick={() => handleRejectStore(s.id)} className="px-5 bg-white/5 text-white/50 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] p-6 rounded-[32px] border border-white/5">
                <Activity className="text-slate-400 mb-4" />
                <p className="text-3xl font-black tracking-tighter">{activeStores.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Tiendas Activas</p>
              </div>
              <div className="bg-[#111] p-6 rounded-[32px] border border-white/5">
                <TrendingUp className="text-green-500 mb-4" />
                <p className="text-3xl font-black tracking-tighter">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Uptime</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-2xl tracking-tighter uppercase mb-8 flex items-center gap-3">
              Directorio de Llaves <span className="text-[12px] font-bold opacity-30 tracking-widest bg-white/10 px-3 py-1 rounded-full">{activeStores.length}</span>
            </h3>
            <div className="space-y-4">
              {activeStores.map(s => (
                <div key={s.id} className={`bg-[#111] p-6 rounded-[32px] border ${s.status === 'suspended' ? 'border-red-500/30 opacity-70' : 'border-white/5 hover:border-white/10'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group relative overflow-hidden`}>
                  <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: s.primaryColor || '#ffffff' }}></div>
                  <div className="flex items-center gap-4 pl-2">
                    {s.logo ? (
                      <SafeImage src={getImageUrl(s, s.logo, '100x100')} alt={s.name} className="w-12 h-12 rounded-xl bg-black" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black">{s.name.charAt(0)}</div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-lg uppercase tracking-tight">{s.name} {s.status === 'suspended' && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">(Suspendida)</span>}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{s.category || 'Sin Categoría'} • WA: {s.whatsapp}</p>
                    </div>
                  </div>
                  <div className="bg-black border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400">{s.id}</span>
                    <button onClick={() => { navigator.clipboard.writeText(s.id); toast.success('Store ID Copiado'); }} className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-slate-300 transition-colors">Copiar ID</button>
                    <button onClick={() => handleToggleStoreStatus(s)} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${s.status === 'approved' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}>
                      {s.status === 'approved' ? 'Suspender' : 'Reactivar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
