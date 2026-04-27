import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MarketplaceView from './pages/MarketplaceView';
import AuthView from './pages/AuthView';
import BuyerPortalView from './pages/BuyerPortalView';
import SellerPortalView from './pages/SellerPortalView';
import SuperAdminView from './pages/SuperAdminView';
import StoreCatalogView from './pages/StoreCatalogView';

// ============================================================================
// ENRUTADOR PRINCIPAL — CapiMercado
// Todas las vistas han sido modularizadas en /pages/
// ============================================================================
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketplaceView />} />
      <Route path="/auth" element={<AuthView />} />
      <Route path="/mi-cuenta" element={<BuyerPortalView />} />
      <Route path="/stores/:slug" element={<StoreCatalogView />} />
      <Route path="/store/:slug" element={<MarketplaceView />} />
      <Route path="/panel" element={<SellerPortalView />} />
      <Route path="/admin-control-valencia-2026" element={<SuperAdminView />} />
      <Route path="*" element={<MarketplaceView />} />
    </Routes>
  );
}