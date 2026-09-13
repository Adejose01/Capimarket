import React from "react";
import { Routes, Route, useLocation, useNavigate, Location } from "react-router-dom";
import AuthView from "@/pages/auth/AuthView";
// dashboard
import BuyerPortalView from "@/pages/dashboard/buyer/BuyerPortalView";
import SellerPortalView from "@/pages/dashboard/seller/SellerPortalView";
// Footer Links
import PrivacyView from "@/pages/info/PrivacyView";
import TermsView from "@/pages/info/TermsView";
import AboutView from "@/pages/info/AboutView";
import SupportView from "@/pages/info/SupportView";
import FaqView from "@/pages/info/FaqView";
import ContactView from "@/pages/info/ContactView";
// Marketplace
import MarketplaceView from "@/pages/marketplace/MarketplaceView";
import ProductDetailView from "@/pages/marketplace/ProductDetailView";
// store
import StoreCatalogView from "@/pages/store/StoreCatalogView";
// 404
import NotFoundView from "@/pages/info/NotFoundView";
// Components
import ErrorBoundary from "@/components/common/ErrorBoundary";
import pb from "@/lib/pocketbase";

// Tipamos el state que le pasas al router cuando abres un producto como modal
interface LocationState {
  background?: Location;
}

export default function App(): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = pb.authStore.isValid;

  // Verificar si el usuario intenta acceder a /contact sin estar autenticado
  React.useEffect(() => {
    if (location.pathname === "/contact" && !isAuthenticated) {
      navigate("/auth", { state: { from: location.pathname } });
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<MarketplaceView />} />
        <Route path="/auth" element={<AuthView />} />
        <Route path="/account" element={<BuyerPortalView />} />
        <Route path="/stores/:slug" element={<StoreCatalogView />} />
        <Route path="/store/:slug" element={<MarketplaceView />} />
        <Route path="/producto/:id" element={<ProductDetailView />} />
        <Route path="/panel" element={<SellerPortalView />} />

        {/* Footer Links */}
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/terms" element={<TermsView />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/support" element={<SupportView />} />
        <Route path="/faq" element={<FaqView />} />
        <Route path="/contact" element={<ContactView />} />

        {/* Catch-all 404: Debe ir estrictamente al final */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>

      {/* Renderiza el modal sobre la vista principal si existe state */}
      {location.state && (
        <Routes>
          <Route path="/producto/:id" element={<ProductDetailView />} />
        </Routes>
      )}
    </ErrorBoundary>
  );
}
