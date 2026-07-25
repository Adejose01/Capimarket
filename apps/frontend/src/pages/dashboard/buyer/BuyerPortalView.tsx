import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import useAuthStore from "@/lib/useAuthStore";
import { StoreService } from "@/lib/services/pb/store.service";
import { BuyerProfileHeader } from "@/components/features/buyer/BuyerProfileHeader";
import { BuyerAccountActions } from "@/components/features/buyer/BuyerAccountActions";
import { ApplyStoreModal } from "@/components/features/buyer/ApplyStoreModal";

export default function BuyerPortalView() {
  const [myStores, setMyStores] = useState<unknown[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const fetchStores = () => {
    if (!user?.id) return;
    StoreService.getByOwner(user.id)
      .then(setMyStores)
      .catch(() => setMyStores([]));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    fetchStores();
  }, [isAuthenticated, navigate, user?.id]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-200 flex flex-col">
      {showApplyModal && (
        <ApplyStoreModal
          userId={user.id}
          userEmail={user.email}
          onClose={() => setShowApplyModal(false)}
          onSuccess={fetchStores}
        />
      )}

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="text-slate-400 hover:text-slate-900 transition-colors" />
              <span className="font-bold tracking-tight">Volver a Tienda</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-xl cursor-pointer"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 grow max-w-3xl mx-auto w-full px-4">
        <BuyerProfileHeader name={user.name} email={user.email} />
        <BuyerAccountActions
          hasStores={myStores.length > 0}
          onNavigateToPanel={() => navigate("/panel")}
          onOpenApplyModal={() => setShowApplyModal(true)}
        />
      </main>
    </div>
  );
}