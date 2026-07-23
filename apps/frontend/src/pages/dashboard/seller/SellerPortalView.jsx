import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  LogOut,
  ArrowLeft,
  Key,
  Plus,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import useAuthStore from "@/lib/useAuthStore";
import SafeImage from "@/components/common/SafeImage";
import BrandSettings from "@/components/features/seller/BrandSettings";
import InventoryList from "@/components/features/seller/InventoryList";
import ProductFormModal from "@/components/features/seller/ProductFormModal";
import { StoreService } from "@/lib/services/pb/store.service";
import { ProductsService } from "@/lib/services/pb/products.service";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function SellerPortalView() {
  const [myStores, setMyStores] = useState([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [selectedStore, setSelectedStore] = useState(null);
  const [inventory, setInventory] = useState([]);

  const [view, setView] = useState("inventory");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const loadInventory = (id) => {
    if (!id) return;

    ProductsService.getByStore(id)
      .then((records) => {
        setInventory(records);
      })
      .catch((err) => {
        console.error("Error al cargar inventario:", err);
        setInventory([]);
      });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    StoreService.getByOwner(user.id)
      .then((stores) => {
        setMyStores(stores);
        setIsLoadingStore(false);
      })
      .catch((err) => {
        console.error(err);
        setMyStores([]);
        setIsLoadingStore(false);
      });
  }, [isAuthenticated, navigate, user?.id]);

  if (!isAuthenticated) return null;

  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-pulse">
        Cargando panel...
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Selector de Empresas
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Elige la tienda que deseas administrar
            </p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myStores?.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  setSelectedStore(store);
                  loadInventory(store.id);
                }}
                className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm hover:shadow-premium transition-all cursor-pointer flex flex-col gap-4 hover:-translate-y-1"
              >
                {store.logo ? (
                  <SafeImage
                    src={getImageUrl(store, store.logo, "100x100")}
                    alt={store.name}
                    className="w-16 h-16 rounded-2xl bg-slate-50 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-slate-50 text-slate-400">
                    {store.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-xl tracking-tight text-slate-900">
                    {store.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-400">
                    {store.category || "Sin Categoría"}
                  </p>
                </div>
              </div>
            ))}
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

      <div className="max-w-350 mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100/50">
          <div className="flex items-center gap-6">
            {selectedStore.logo && (
              <SafeImage
                src={getImageUrl(selectedStore, selectedStore.logo, "100x100")}
                alt="Logo"
                className="w-16 h-16 rounded-[20px] shadow-sm bg-white"
              />
            )}
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
                {selectedStore.name}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sistema en línea
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white border shadow-sm rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Volver al Inicio
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white border shadow-sm rounded-full text-xs font-bold text-red-500 hover:bg-red-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 border-b border-slate-100 pb-4 px-1">
          <button
            onClick={() => setView("inventory")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${view === "inventory" ? "bg-slate-900 text-white" : "bg-white text-slate-500"}`}
          >
            Mi Inventario
          </button>
          <button
            onClick={() => setView("create")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${view === "create" ? "bg-slate-900 text-white" : "bg-white text-slate-500"}`}
          >
            Nuevo Artículo
          </button>
          <button
            onClick={() => setView("brand")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${view === "brand" ? "bg-slate-900 text-white" : "bg-white text-slate-500"}`}
          >
            Configuración
          </button>
        </div>

        {view === "create" && (
          <ProductFormModal
            product={null}
            selectedStoreId={selectedStore.id}
            onSuccess={() => {
              setView("inventory");
              loadInventory(selectedStore.id);
            }}
          />
        )}
        {view === "inventory" && (
          <InventoryList
            inventory={inventory}
            setEditingProduct={setEditingProduct}
            setView={setView}
            selectedStoreId={selectedStore.id}
            reloadInventory={loadInventory}
          />
        )}
        {view === "brand" && (
          <BrandSettings
            selectedStore={selectedStore}
            onUpdateSuccess={(store) => {
              setSelectedStore(store);
              setMyStores(myStores.map((s) => (s.id === store.id ? store : s)));
            }}
          />
        )}
      </div>
    </div>
  );
}
