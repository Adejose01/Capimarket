import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Package, LogOut, ArrowLeft, Key, Plus, Settings, LayoutGrid } from 'lucide-react';
import pb from '../lib/pocketbase';
import { getImageUrl } from '../lib/utils';
import useAuthStore from '../store/useAuthStore';
import SafeImage from '../components/SafeImage';
import BrandSettings from '../components/seller/BrandSettings';
import InventoryList from '../components/seller/InventoryList';
import ProductFormModal from '../components/seller/ProductFormModal';

export default function SellerPortalView() {
  const [myStores, setMyStores] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [selectedStore, setSelectedStore] = useState(null);
  const [storeIdInput, setStoreIdInput] = useState('');
  const [inventory, setInventory] = useState([]);

  const [view, setView] = useState('inventory');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    pb.collection('stores').getFullList({ filter: `owner = "${user?.id}"` })
      .then(stores => {
        setMyStores(stores);
        if (stores.length === 1) {
          setSelectedStore(stores[0]);
          loadInventory(stores[0].id);
        }
        setIsLoadingStore(false);
      })
      .catch((err) => { console.error(err); setMyStores([]); setIsLoadingStore(false); });
  }, []);

  if (!isAuthenticated) return null;

  const handleClaimStore = async (e) => {
    e.preventDefault();
    if (!storeIdInput) return;
    try {
      const updatedStore = await pb.collection('stores').update(storeIdInput, {
        owner: user?.id
      });
      setMyStores([...myStores, updatedStore]);
      setSelectedStore(updatedStore);
      loadInventory(updatedStore.id);
      toast.success('¡Tienda vinculada con éxito!');
    } catch (error) {
      console.error(error);
      toast.error('Store ID inválido o la tienda ya tiene dueño.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const loadInventory = async (id) => {
    const records = await pb.collection('products').getFullList({
      filter: `store = "${id}"`
    });
    setInventory(records);
  };

  if (isLoadingStore) {
    return <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-pulse">Cargando panel...</div>;
  }

  if (myStores.length > 1 && !selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2">Selector de Empresas</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Elige la tienda que deseas administrar</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myStores?.map(store => (
              <div
                key={store.id}
                onClick={() => { setSelectedStore(store); loadInventory(store.id); }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-premium transition-all cursor-pointer flex flex-col gap-4 hover:-translate-y-1"
              >
                {store.logo ? (
                  <SafeImage src={getImageUrl(store, store.logo, '100x100')} alt={store.name} className="w-16 h-16 rounded-2xl bg-slate-50 shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-slate-50 text-slate-400">{store.name.charAt(0)}</div>
                )}
                <div>
                  <h4 className="font-extrabold text-xl tracking-tight text-slate-900">{store.name}</h4>
                  <p className="text-xs font-bold text-slate-400">{store.category || 'Sin Categoría'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-premium">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Validación de Tienda</h2>
            <form onSubmit={handleClaimStore} className="space-y-4">
              <input type="text" required placeholder="ID Secreto de Tienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm font-medium outline-none shadow-sm" value={storeIdInput} onChange={(e) => setStoreIdInput(e.target.value)} />
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-full text-sm font-bold shadow-premium mt-4">Vincular Tienda</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans relative">
      {editingProduct && (
        <ProductFormModal 
          product={editingProduct} 
          selectedStoreId={selectedStore.id} 
          onClose={() => setEditingProduct(null)} 
          onSuccess={() => {
            setEditingProduct(null);
            loadInventory(selectedStore.id);
          }} 
        />
      )}

      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100/50">
          <div className="flex items-center gap-6">
            {selectedStore.logo && <SafeImage src={getImageUrl(selectedStore, selectedStore.logo, '100x100')} alt="Logo" className="w-16 h-16 rounded-[20px] shadow-sm bg-white" />}
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">{selectedStore.name}</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sistema en línea</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="px-6 py-3 bg-white border shadow-sm rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50">Volver al Inicio</button>
            <button onClick={handleLogout} className="px-6 py-3 bg-white border shadow-sm rounded-full text-xs font-bold text-red-500 hover:bg-red-50">Cerrar Sesión</button>
          </div>
        </header>

        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 border-b border-slate-100 pb-4 px-1">
          <button onClick={() => setView('inventory')} className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'inventory' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>Mi Inventario</button>
          <button onClick={() => setView('create')} className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'create' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>Nuevo Artículo</button>
          <button onClick={() => setView('brand')} className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'brand' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>Configuración</button>
        </div>

        {view === 'create' && (
          <ProductFormModal 
            product={null} 
            selectedStoreId={selectedStore.id} 
            onSuccess={() => {
              setView('inventory');
              loadInventory(selectedStore.id);
            }} 
          />
        )}
        {view === 'inventory' && <InventoryList inventory={inventory} setEditingProduct={setEditingProduct} setView={setView} selectedStoreId={selectedStore.id} reloadInventory={loadInventory} />}
        {view === 'brand' && <BrandSettings selectedStore={selectedStore} onUpdateSuccess={(store) => { setSelectedStore(store); setMyStores(myStores.map(s => s.id === store.id ? store : s)); }} />}
      </div>
    </div>
  );
}
