import React from "react";
import { Lock, ChevronRight, Settings, Store } from "lucide-react";

interface BuyerAccountActionsProps {
  hasStores: boolean;
  onNavigateToPanel: () => void;
  onOpenApplyModal: () => void;
}

export const BuyerAccountActions: React.FC<BuyerAccountActionsProps> = ({
  hasStores,
  onNavigateToPanel,
  onOpenApplyModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors cursor-pointer group flex items-center justify-between bg-white">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Lock size={16} /> Seguridad y Contraseña
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Actualiza tus credenciales de acceso
          </p>
        </div>
        <ChevronRight className="text-slate-300 group-hover:text-slate-900 transition-colors px-2" />
      </div>

      {hasStores ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onNavigateToPanel}
            className="p-6 border border-slate-900 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <Settings
              size={28}
              className="text-slate-900 group-hover:rotate-90 transition-transform duration-500"
            />
            <h3 className="font-bold text-slate-900">
              Administrar mis Tiendas
            </h3>
            <p className="text-xs text-slate-500">
              Ingresa al panel de control de tus negocios actuales.
            </p>
          </button>
          <button
            onClick={onOpenApplyModal}
            className="p-6 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center gap-3 bg-white"
          >
            <Store className="text-slate-400 w-8 h-8 group-hover:text-slate-600 transition-colors" />
            <h3 className="font-bold text-slate-900">Crear nueva Tienda</h3>
            <p className="text-xs text-slate-500">
              Solicita abrir otra sucursal u otra marca.
            </p>
          </button>
        </div>
      ) : (
        <div
          className="p-6 border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center bg-slate-50 gap-3 hover:border-slate-300 transition-colors cursor-pointer"
          onClick={onOpenApplyModal}
        >
          <Store className="text-slate-300 w-8 h-8" />
          <p className="font-bold text-slate-700">
            Crear mi Tienda / Quiero Vender
          </p>
          <p className="text-xs text-slate-500 max-w-sm mb-2">
            Si eres una tienda de tecnología y deseas publicar aquí, envía tu
            solicitud.
          </p>
          <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:bg-slate-800 transition-colors cursor-pointer">
            Aplicar para Vender
          </button>
        </div>
      )}
    </div>
  );
};