import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MarketplaceView from '@/pages/MarketplaceView';
import AuthView from '@/pages/AuthView';
import BuyerPortalView from '@/pages/BuyerPortalView';
import SellerPortalView from '@/pages/SellerPortalView';
import SuperAdminView from '@/pages/SuperAdminView';
import StoreCatalogView from '@/pages/StoreCatalogView';
import ProductDetailView from '@/pages/ProductDetailView';
// Footer Links
import PrivacyView from '@/pages/PrivacyView';
import TermsView from '@/pages/TermsView';
import AboutView from '@/pages/AboutView';
import SupportView from '@/pages/SupportView';
import FaqView from '@/pages/FaqView';
import ContactView from '@/pages/ContactView';

import ErrorBoundary from './components/common/ErrorBoundary';

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
