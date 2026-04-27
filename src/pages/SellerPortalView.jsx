import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Package, LogOut, ArrowLeft, X, Plus, Trash2, Key, Edit2, Palette, Settings, LayoutGrid, MessageCircle, Smartphone } from 'lucide-react';
import pb from '../lib/pocketbase';
import { getImageUrl } from '../lib/utils';
import useAuthStore from '../store/useAuthStore';
import SafeImage from '../components/SafeImage';

export default function SellerPortalView() {
  const [myStores, setMyStores] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [selectedStore, setSelectedStore] = useState(null);
  const [storeIdInput, setStoreIdInput] = useState('');
  const [inventory, setInventory] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [view, setView] = useState('inventory');
  const [isUpdatingBrand, setIsUpdatingBrand] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  // Imágenes
  const [newProductImages, setNewProductImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [categories, setCategories] = useState([]);
  useEffect(() => { pb.collection('categories').getFullList().then(setCategories).catch(() => {}); }, []);


  useEffect(() => {
    return () => {
      newProductImages.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
      if (previewBanner) URL.revokeObjectURL(previewBanner);
      if (previewLogo) URL.revokeObjectURL(previewLogo);
    };
  }, [newProductImages, previewBanner, previewLogo]);

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

  useEffect(() => {
    setNewProductImages([]);
    setImagesToDelete([]);
  }, [editingProduct, view]);

  // Intentar cargar la tienda si el usuario está autenticado
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
      .catch((err) => { console.error('Error exacto de PB (SellerPortal):', err.response?.data); console.error(err); setMyStores([]); setIsLoadingStore(false); });
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formElement = e.target;
    const fd = new FormData(formElement);
    fd.append('store', selectedStore.id);
    fd.delete('images');
    newProductImages.forEach(img => fd.append('images', img.file));

    try {
      await pb.collection('products').create(fd);
      formElement.reset();
      setNewProductImages([]);
      loadInventory(selectedStore.id);
      setView('inventory');
      toast.success('Producto publicado en CapiMercado.');
    } catch (err) {
      console.error(err);
      toast.error('Error al subir el producto.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditarProducto = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formElement = e.target;
    const fd = new FormData(formElement);

    fd.delete('images');
    // Agregar nuevas imagenes
    if (newProductImages.length > 0) {
      newProductImages.forEach(img => fd.append('images', img.file));
    }
    // Eliminar imagenes marcadas con X
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(filename => fd.append('images-', filename));
    }

    try {
      await pb.collection('products').update(editingProduct.id, fd);
      toast.success('¡Publicación actualizada!');
      setEditingProduct(null);
      setNewProductImages([]);
      setImagesToDelete([]);
      loadInventory(selectedStore.id);
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto definitivamente?')) {
      await pb.collection('products').delete(id);
      loadInventory(selectedStore.id);
    }
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    setIsUpdatingBrand(true);
    const formElement = e.target;
    const fd = new FormData(formElement);

    try {
      const updatedStore = await pb.collection('stores').update(selectedStore.id, fd);
      setSelectedStore(updatedStore);
      setMyStores(myStores?.map(s => s.id === updatedStore.id ? updatedStore : s));
      setPreviewBanner(null);
      setPreviewLogo(null);
      toast.success('¡Tienda actualizada!');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar la marca.');
    } finally {
      setIsUpdatingBrand(false);
    }
  };

  // PANTALLA DE RECLAMAR TIENDA
  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-pulse">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-12 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-200/50 rounded-[20px]"></div>
              <div>
                <div className="w-48 h-8 bg-slate-200/50 rounded-lg mb-3"></div>
                <div className="w-24 h-3 bg-slate-200/50 rounded-full"></div>
              </div>
            </div>
            <div className="hidden md:block w-32 h-10 bg-slate-200/50 rounded-full"></div>
          </div>
          <div className="flex gap-4 mb-8">
            <div className="w-32 h-10 bg-slate-200/50 rounded-full"></div>
            <div className="w-32 h-10 bg-slate-200/50 rounded-full"></div>
          </div>
          <div className="h-[200px] bg-slate-200/50 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-200/50 rounded-3xl"></div>
            <div className="h-32 bg-slate-200/50 rounded-3xl"></div>
            <div className="h-32 bg-slate-200/50 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (myStores.length > 1 && !selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans selection:bg-luxury-green/20">
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
          <button onClick={() => navigate('/')} className="mt-12 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} /> Volver al Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 selection:bg-luxury-green/20">
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="mb-12 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} /> Volver al Marketplace
          </button>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-premium">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Key className="text-luxury-green" size={24} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Validación <br />de Tienda</h2>
            <p className="text-xs font-bold text-slate-500 mb-10">Ingresa el ID secreto proporcionado al aprobar tu solicitud.</p>

            <form onSubmit={handleClaimStore} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="ID Secreto de Tienda"
                  className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm font-medium outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-colors placeholder:text-slate-400 shadow-sm"
                  value={storeIdInput}
                  onChange={(e) => setStoreIdInput(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-premium hover:-translate-y-0.5 mt-4">
                Vincular Tienda y Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD VENDEDOR
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans relative">

      {/* MODAL DE EDICIÓN DE PRODUCTO */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-2xl border border-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 text-luxury-green rounded-2xl flex items-center justify-center shadow-sm"><Edit2 size={24} /></div>
              <h3 className="font-extrabold text-2xl tracking-tight">Editar Publicación</h3>
            </div>

            <form onSubmit={handleEditarProducto} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Nombre del Producto</label>
                  <input name="name" type="text" defaultValue={editingProduct.name} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Precio (USDT)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct.price} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Categoría</label>
                  <select name="category" defaultValue={editingProduct.category} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="" disabled>Selecciona...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Marca (Opcional)</label>
                  <input name="brand" type="text" defaultValue={editingProduct.brand} placeholder="Ej: Apple, Samsung..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Condición</label>
                  <select name="condition" defaultValue={editingProduct.condition || 'new'} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="new">✨ Nuevo</option>
                    <option value="open_box">📂 Open Box</option>
                    <option value="used">📦 Usado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Stock</label>
                  <select name="stock" defaultValue={editingProduct.stock || 'available'} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="available">✅ Disponible</option>
                    <option value="out_of_stock">❌ Agotado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Detalles de uso (Opcional)</label>
                <input name="usage_details" type="text" defaultValue={editingProduct.usage_details} placeholder="Ej: Condición 9/10..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción Detallada</label>
                <textarea name="description" rows="3" defaultValue={editingProduct.description} placeholder="Incluye: caja original, cable USB-C, garantia del vendedor..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
              </div>

              <div>
                {/* Galeria EXISTENTE en PocketBase - con X para eliminar */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="mb-5">
                    <label className="text-xs font-bold text-slate-500 mb-3 block">
                      Fotos actuales ({editingProduct.images.length - imagesToDelete.length} activas — haz clic en X para eliminar)
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2.5">
                      {editingProduct.images.map((filename) => {
                        const isMarked = imagesToDelete.includes(filename);
                        return (
                          <div key={filename} className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${isMarked ? 'opacity-30 grayscale border-red-300' : 'border-slate-100 hover:border-slate-300'}`}>
                            <img src={getImageUrl(editingProduct, filename, '200x200')} alt="foto" className="w-full h-full object-cover" />
                            {isMarked ? (
                              <button type="button" onClick={() => setImagesToDelete(prev => prev.filter(f => f !== filename))}
                                className="absolute inset-0 bg-red-400/20 flex items-center justify-center text-red-600 font-extrabold text-[9px] uppercase tracking-widest">
                                Deshacer
                              </button>
                            ) : (
                              <button type="button" onClick={() => setImagesToDelete(prev => [...prev, filename])}
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600">
                                <X size={11} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {imagesToDelete.length > 0 && (
                      <p className="text-xs text-red-500 font-bold mt-2">{imagesToDelete.length} foto(s) se eliminaran al guardar</p>
                    )}
                  </div>
                )}

                {/* Nuevas Imagenes - Preview antes de subir */}
                <label className="text-xs font-bold text-slate-500 mb-3 block">Agregar nuevas fotos</label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {newProductImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-indigo-100 group">
                      <img src={img.preview} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shadow-md">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-luxury-green transition-all cursor-pointer bg-white">
                    <Plus size={22} className="mb-1.5" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-center px-2">{newProductImages.length > 0 ? 'Anadir Mas' : 'Subir Fotos'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-white text-slate-500 border border-slate-200 py-4 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm text-center">
                  Cancelar
                </button>
                <button type="submit" disabled={isUploading} className="flex-1 bg-slate-900 text-white py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-premium hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-center">
                  {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100/50">
          <div className="flex items-center gap-6">
            {selectedStore.logo && (
              <SafeImage
                src={getImageUrl(selectedStore, selectedStore.logo, '100x100')}
                alt="Logo"
                className="w-16 h-16 rounded-[20px] shadow-sm bg-white"
              />
            )}
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
                {selectedStore.name}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-luxury-green animate-pulse"></span> Sistema en línea
              </p>
            </div>
          </div>
          <div className="flex gap-4 self-start md:self-auto">
            {myStores.length > 1 && (
              <button onClick={() => setSelectedStore(null)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <LayoutGrid size={14} /> Cambiar Tienda
              </button>
            )}
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowLeft size={14} /> Volver al Inicio
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </header>

        {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 border-b border-slate-100 pb-4 px-1">
          <button
            onClick={() => setView('inventory')}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'inventory' ? 'bg-slate-900 text-white shadow-premium' : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Package size={18} /> Mi Inventario
          </button>
          <button
            onClick={() => setView('create')}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'create' ? 'bg-slate-900 text-white shadow-premium' : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Plus size={18} /> Nuevo Artículo
          </button>
          <button
            onClick={() => setView('brand')}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'brand' ? 'bg-slate-900 text-white shadow-premium' : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Settings size={18} /> Configuración
          </button>
        </div>

        {view === 'create' && (
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 max-w-4xl mx-auto md:p-12 animate-in fade-in duration-300 shadow-premium">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 text-luxury-green rounded-2xl flex items-center justify-center shadow-sm"><Plus size={24} /></div>
              <h3 className="font-extrabold text-2xl tracking-tight text-slate-900">Nuevo Artículo</h3>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Nombre del Producto</label>
                  <input name="name" type="text" placeholder="Ej: iPhone 16 Pro Max 256GB" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Precio (USDT)</label>
                  <input name="price" type="number" step="0.01" placeholder="999.99" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Categoría</label>
                  <select name="category" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="" disabled selected>Selecciona...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Marca (Opcional)</label>
                  <input name="brand" type="text" placeholder="Ej: Apple, Samsung, Sony..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Condición</label>
                  <select name="condition" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="new">✨ Nuevo</option>
                    <option value="open_box">📂 Open Box</option>
                    <option value="used">📦 Usado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Stock</label>
                  <select name="stock" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="available">✅ Disponible</option>
                    <option value="out_of_stock">❌ Agotado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Detalles de uso (Opcional)</label>
                <input name="usage_details" type="text" placeholder="Ej: Bateria al 95%, sin rayones" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción Detallada</label>
                <textarea name="description" rows="3" placeholder="Especificaciones, lo que incluye en la caja..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Imágenes del Producto</label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {newProductImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                      <img src={img.preview} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-white/60 rounded-full flex items-center justify-center text-slate-900 hover:text-red-500 hover:bg-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl">
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-luxury-green transition-all cursor-pointer bg-white">
                    <Plus size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">{newProductImages.length > 0 ? 'Añadir Más' : 'Subir Fotos'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end">
                <button type="button" onClick={() => setView('inventory')} className="px-8 py-4 bg-white text-slate-500 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer text-center">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-premium hover:-translate-y-0.5 text-center"
                >
                  {isUploading ? 'Subiendo archivo...' : 'Publicar en CapiMercado'}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'inventory' && (
          <div className="animate-in fade-in duration-300 w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-extrabold text-2xl tracking-tighter text-slate-900 flex items-center gap-3">
                <Package className="text-slate-400" /> Inventario Activo <span className="text-xs font-bold text-luxury-green bg-luxury-green/10 px-3 py-1 rounded-full">{inventory.length}</span>
              </h3>
            </div>

            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory?.map(p => {
                  const mainImage = p.images && p.images.length > 0 ? p.images[0] : null;
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
                        <p className="text-slate-900 font-extrabold tracking-tight mt-1">{p.price} <span className="text-[10px] font-medium text-slate-500">USDT</span></p>
                        <div className="flex items-center gap-2 mt-2 max-w-full overflow-hidden">
                          {p.condition && <span className="text-[9px] uppercase tracking-widest bg-slate-100 px-2 py-1 flex-shrink-0 rounded-md text-slate-600 font-semibold">p.condition === 'new' ? '✨ Nuevo' : (p.condition === 'open_box' ? '📂 Open Box' : '📦 Usado')</span>}
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
                  <Plus size={16} /> Publicar Producto
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'brand' && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 max-w-4xl mx-auto animate-in fade-in duration-300 shadow-premium">
            <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-50 text-luxury-green rounded-2xl flex items-center justify-center shadow-sm"><Palette size={24} /></div>
              Personaliza tu Identidad Visual
            </h3>

            <form onSubmit={handleUpdateBrand} className="space-y-8">
              {/* Sección Banner e Info Básica */}
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
                <div className="relative">
                  <input name="banner" type="file" accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPreviewBanner(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-4 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
                  />
                </div>
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
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full p-2 pr-6 focus-within:border-luxury-green focus-within:ring-4 focus-within:ring-luxury-green/10 transition-all shadow-sm">
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

              {/* Ubicación y Descripción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Sede o Ubicación (Para filtros)</label>
                  <input name="location" type="text" defaultValue={selectedStore.location} placeholder="Ej: Valencia, Sambil" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción de la Marca (Bio)</label>
                  <textarea name="description" defaultValue={selectedStore.description} rows="3" placeholder="Somos distribuidores oficiales..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
                </div>
              </div>

              {/* Redes y Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><MessageCircle size={16} className="text-luxury-green" /> WhatsApp Manager</label>
                  <input name="whatsapp" type="text" defaultValue={selectedStore.whatsapp} placeholder="Ej: 58414..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                  <p className="text-xs text-slate-400 mt-2 ml-4">Aquí es a donde llegarán tus ventas.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><IconInstagram size={16} className="text-pink-500" /> Instagram</label>
                  <input name="instagram" type="text" defaultValue={selectedStore.instagram} placeholder="@tutienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><Smartphone size={16} className="text-slate-800" /> TikTok</label>
                  <input name="tiktok" type="text" defaultValue={selectedStore.tiktok} placeholder="@tutienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><IconFacebook size={16} className="text-blue-500" /> Facebook</label>
                  <input name="facebook" type="text" defaultValue={selectedStore.facebook} placeholder="URL o Usuario" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
              </div>

              <button type="submit" disabled={isUpdatingBrand} className="w-full bg-slate-900 text-white py-5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all mt-8 shadow-premium disabled:opacity-50 hover:-translate-y-0.5">
                {isUpdatingBrand ? 'Guardando Cambios...' : 'Guardar y Actualizar Marca'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
