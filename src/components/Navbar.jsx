import React from 'react';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, X, Menu, User, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SPRING } from '../lib/utils';
import useAuthStore from '../store/useAuthStore';

export default function Navbar({
  isScrolled,
  activeStore,
  exclusiveStoreId,
  searchType,
  setSearchType,
  searchTerm,
  setSearchTerm,
  isMenuOpen,
  setIsMenuOpen,
  onResetStore,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 will-change-transform ${isScrolled ? "bg-[#050505]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/20" : "bg-transparent border-b border-transparent"}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-16">

          {/* Logo + Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {(activeStore || exclusiveStoreId) && (
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={onResetStore}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
              >
                <ArrowLeft size={16} />
              </motion.button>
            )}
            <div
              className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 group ${!exclusiveStoreId ? 'cursor-pointer' : ''}`}
              onClick={() => { onResetStore(); navigate('/'); }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-[#050505] font-black text-sm sm:text-lg">C</span>
              </div>
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-white hidden xs:block">CapiMercado</span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={`Buscar ${searchType === 'products' ? 'iPhone, Sony...' : 'tiendas...'}`}
                className="w-full bg-white/10 border border-white/15 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-white/20 transition-all outline-none text-white placeholder:text-white/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            {!exclusiveStoreId && (
              <>
                <button
                  onClick={() => { setSearchType('stores'); onResetStore(); }}
                  className={`text-sm font-semibold transition-colors ${searchType === 'stores' && !activeStore ? 'text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Directorio
                </button>
                <button
                  onClick={() => setSearchType('products')}
                  className={`text-sm font-semibold transition-colors ${searchType === 'products' || activeStore ? 'text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Mercado
                </button>
              </>
            )}
            {isAuthenticated ? (
              <button onClick={() => navigate('/mi-cuenta')} className="flex items-center gap-2 text-sm font-bold text-white hover:text-brand-green transition-colors bg-white/10 px-4 py-2 rounded-lg border border-white/10 shadow-sm">
                <User size={16} /> Mi Cuenta
              </button>
            ) : (
              <button onClick={() => navigate('/auth')} className="text-sm font-bold bg-white text-[#050505] px-6 py-2 rounded-full hover:bg-slate-200 transition-colors shadow-md">
                Ingresar
              </button>
            )}
          </div>

          {/* Mobile — right side: Ingresar + Hamburguesa */}
          <div className="md:hidden flex items-center gap-2">
            {!isAuthenticated ? (
              <button onClick={() => { navigate('/auth'); setIsMenuOpen(false); }} className="text-xs font-bold bg-white text-[#050505] px-4 py-1.5 rounded-full">
                Ingresar
              </button>
            ) : (
              <button onClick={() => { navigate('/mi-cuenta'); setIsMenuOpen(false); }} className="text-xs font-bold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <User size={13} /> Cuenta
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-1 ml-1">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 px-3 py-4 space-y-3 shadow-xl">
          {!exclusiveStoreId && (
            <div className="flex gap-1.5 p-1 bg-white/10 rounded-xl">
              <button onClick={() => { setSearchType('products'); setIsMenuOpen(false); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${searchType === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70'}`}>Productos</button>
              <button onClick={() => { setSearchType('stores'); setIsMenuOpen(false); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${searchType === 'stores' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70'}`}>Tiendas</button>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="¿Qué buscas hoy?"
              className="w-full bg-white/10 border border-white/15 rounded-full py-2.5 pl-10 pr-4 outline-none text-sm text-white placeholder:text-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
    </nav>
  );
}
