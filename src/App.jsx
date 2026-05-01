import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MarketplaceView from './pages/MarketplaceView';
import AuthView from './pages/AuthView';
import BuyerPortalView from './pages/BuyerPortalView';
import SellerPortalView from './pages/SellerPortalView';
import SuperAdminView from './pages/SuperAdminView';
import StoreCatalogView from './pages/StoreCatalogView';
import ProductDetailView from './pages/ProductDetailView';
import PrivacyView from './pages/PrivacyView';
import TermsView from './pages/TermsView';

import ErrorBoundary from './components/ErrorBoundary';

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
        {/* Renderiza la ruta normal si no hay background (por ej. visita directa al enlace) */}
        <Route path="/producto/:id" element={<ProductDetailView />} />
        <Route path="/panel" element={<SellerPortalView />} />
        <Route path="/admin-control-valencia-2026" element={<SuperAdminView />} />
        <Route path="/privacy" element={<PrivacyView />} />
        <Route path="/terms" element={<TermsView />} />
        <Route path="*" element={<MarketplaceView />} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/producto/:id" element={<ProductDetailView />} />
        </Routes>
      )}
    </ErrorBoundary>
  );
}
