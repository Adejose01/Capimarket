import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import useAuthStore from "@/lib/useAuthStore";
import SafeImage from "@/components/common/SafeImage";
import BrandSettings from "@/components/features/seller/BrandSettings";
import InventoryList from "@/components/features/seller/InventoryList";
import ProductFormModal from "@/components/features/seller/ProductFormModal";
import { ApplyStoreModal } from "@/components/features/buyer/ApplyStoreModal"; // Asegúrate de ajustar esta ruta según tu estructura
import { StoreService } from "@/lib/services/pb/store.service";
import { ProductsService } from "@/lib/services/pb/products.service";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import type { ProductRecord, StoreRecord } from "@/lib/types/pocketbase";

export default function SellerPortalView() {
  const [myStores, setMyStores] = useState<StoreRecord[]>([]);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [selectedStore, setSelectedStore] = useState<StoreRecord | null>(null);
  const [inventory, setInventory] = useState<ProductRecord[]>([]);

  const [view, setView] = useState("inventory");
const [editingProduct, setEditingProduct] = useState<ProductRecord | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  

  // Límite según membresía (por defecto 4 si no está definido)
  const getMaxStoresLimit = (membership) => {
    if (!membership) return 4;
    // Si en el futuro agregas niveles de membresía:
    // if (membership === 'pro') return 10;
    return 4;
  };

  const maxAllowedStores = getMaxStoresLimit(user?.membership);
  const canAddMoreStores = myStores.length < maxAllowedStores;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const loadStores = useCallback(() => {
    if (!user?.id) return;
    setIsLoadingStore(true);
    StoreService.getByOwner(user.id)
      .then((stores) => {
        setMyStores(stores);
      })
      .catch((err) => {
        console.error(err);
        setMyStores([]);
      })
      .finally(() => {
        setIsLoadingStore(false);
      });
  }, [user?.id]);

  const loadInventory = (id) => {
    if (!id) return;

    ProductsService.getProductsByStoreId(id)
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
    loadStores();
  }, [isAuthenticated, navigate, loadStores]);

  if (!isAuthenticated) return null;
  if (!isAuthenticated || !user) return null;

  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-pulse font-sans">
        Cargando panel...
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans relative">
        {/* Modal de Solicitud de Tienda */}
        {isApplyModalOpen && (
          <ApplyStoreModal
            userId={user.id}
            userEmail={user.email}
            onClose={() => setIsApplyModalOpen(false)}
            onSuccess={() => {
              loadStores();
            }}
          />
        )}

        <div className="max-w-4xl mx-auto">
          <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2">
                Selector de Empresas
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Elige la tienda que deseas administrar ({myStores.length} de{" "}
                {maxAllowedStores} permitidas)
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-white border border-slate-200 shadow-xs rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Lista de Tiendas existentes */}
            {myStores?.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  setSelectedStore(store);
                  loadInventory(store.id);
                }}
                className="bg-white p-6 rounded-4xl border border-slate-100 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col gap-4 hover:-translate-y-1"
              >
                {store.logo ? (
                  <SafeImage
                    src={getImageUrl(store, store.logo, "100x100")}
                    alt={store.name}
                    className="w-16 h-16 rounded-2xl bg-slate-50 shadow-xs"
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

            {/* Tarjeta para Agregar Nueva Tienda */}
            <div
              onClick={() => {
                if (canAddMoreStores) {
                  setIsApplyModalOpen(true);
                }
              }}
              className={`p-6 rounded-4xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-3 transition-all min-h-45 ${
                canAddMoreStores
                  ? "bg-white border-slate-200 hover:border-slate-900 shadow-xs hover:shadow-lg cursor-pointer hover:-translate-y-1 group"
                  : "bg-slate-100/60 border-slate-200 cursor-not-allowed opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  canAddMoreStores
                    ? "bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Plus size={24} />
              </div>
              <div>
                <h4 className="font-extrabold text-base tracking-tight text-slate-900">
                  {canAddMoreStores ? "Crear Nueva Tienda" : "Límite Alcanzado"}
                </h4>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  {canAddMoreStores
                    ? `Puedes agregar hasta ${maxAllowedStores - myStores.length} tienda(s) más`
                    : `Has alcanzado el máximo de ${maxAllowedStores} tiendas`}
                </p>
              </div>
            </div>
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
                className="w-16 h-16 rounded-[20px] shadow-xs bg-white"
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
              onClick={() => setSelectedStore(null)}
              className="px-6 py-3 bg-white border shadow-xs rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cambiar Tienda
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white border shadow-xs rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Volver al Inicio
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white border shadow-xs rounded-full text-xs font-bold text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 border-b border-slate-100 pb-4 px-1">
          <button
            onClick={() => setView("inventory")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
              view === "inventory"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            Mi Inventario
          </button>
          <button
            onClick={() => setView("create")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
              view === "create"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            Nuevo Artículo
          </button>
          <button
            onClick={() => setView("brand")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all cursor-pointer ${
              view === "brand"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100"
            }`}
          >
            Configuración
          </button>
        </div>

{view === "create" && (
  <ProductFormModal
    product={null}
    selectedStoreId={selectedStore.id}
    onClose={() => setView("inventory")} // 👈 Agrega esta prop
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
        {view === "brand" && selectedStore && (
          <BrandSettings
            key={selectedStore.id}
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
