import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthView from '@/pages/auth/AuthView';
// dashboard
import SuperAdminView from '@/pages/dashboard/admin/SuperAdminView';
import BuyerPortalView from '@/pages/dashboard/buyer/BuyerPortalView';
import SellerPortalView from '@/pages/dashboard/seller/SellerPortalView';
// Footer Links
import PrivacyView from '@/pages/info/PrivacyView';
import TermsView from '@/pages/info/TermsView';
import AboutView from '@/pages/info/AboutView';
import SupportView from '@/pages/info/SupportView';
import FaqView from '@/pages/info/FaqView';
import ContactView from '@/pages/info/ContactView';
// Marketplace
import MarketplaceView from '@/pages/marketplace/MarketplaceView';
import ProductDetailView from '@/pages/marketplace/ProductDetailView';
// store
import StoreCatalogView from '@/pages/store/StoreCatalogView';
// Components
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <ErrorBoundary>
      <Routes location={background || location}>
        <Route path="/" element={<MarketplaceView />} />
        <Route path="/auth" element={<AuthView />} />
        <Route path="/mi-cuenta" element={<BuyerPortalView />} />
        <Route path="/stores/:slug" element={<StoreCatalogView />} />
        <Route path="/store/:slug" element={<MarketplaceView />} />
        <Route path="*" element={<MarketplaceView />} />
        {/* Renderiza la ruta normal si no hay background (por ej. visita directa al enlace) */}
        <Route path="/producto/:id" element={<ProductDetailView />} />
        <Route path="/panel" element={<SellerPortalView />} />
        <Route path="/admin-control-valencia-2026" element={<SuperAdminView />} />
        {/* Footer Links */}
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/terms" element={<TermsView />} />
        <Route path="/about" element={<AboutView />} />
        <Route path="/support" element={<SupportView />} />
        <Route path="/faq" element={<FaqView />} />
        <Route path="/contact" element={<ContactView />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/producto/:id" element={<ProductDetailView />} />
        </Routes>
      )}
    </ErrorBoundary>
  );
}
