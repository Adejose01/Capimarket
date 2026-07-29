import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, ArrowLeft, X, Menu, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { SPRING } from "@/lib/utils";
import useAuthStore from "@/lib/useAuthStore";

interface NavbarProps {
  isScrolled?: boolean;
  activeStore?: any;
  exclusiveStoreId?: string;
  searchType?: "products" | "stores";
  setSearchType?: (type: "products" | "stores") => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  isMenuOpen?: boolean;
  setIsMenuOpen?: (open: boolean) => void;
  onResetStore?: () => void;
  /**
   * Define la variante de la Navbar:
   * - "full": Muestra la Navbar completa con buscador y filtros (Vista principal).
   * - "minimal": Muestra únicamente el Logo y los botones de Login/Cuenta (Páginas simples como /contact).
   */
  variant?: "full" | "minimal";
  /**
   * Ajusta la paleta de colores para vistas con fondo claro ("light") o fondo oscuro ("dark")
   */
  theme?: "dark" | "light";
}

export default function Navbar({
  isScrolled = false,
  activeStore,
  exclusiveStoreId,
  searchType = "products",
  setSearchType,
  searchTerm = "",
  setSearchTerm,
  isMenuOpen = false,
  setIsMenuOpen,
  onResetStore,
  variant = "full",
  theme = "dark",
}: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const isLight = theme === "light";

  const scrollToCatalog = () => {
    const catalogElement = document.getElementById("catalogo");
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = () => {
    if (onResetStore) onResetStore();

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Estilos dinámicos según el tema (Dark/Light) y el scroll
  const navBgClass = isScrolled
    ? isLight
      ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs"
      : "bg-[#050505]/85 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/20"
    : "bg-transparent border-b border-transparent";

  const textColorClass = isLight ? "text-slate-900" : "text-white";
  const logoBgClass = isLight ? "bg-slate-900 text-white" : "bg-white text-[#050505]";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 will-change-transform ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 sm:h-16">
          
          {/* 1. Logo + Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {(activeStore || exclusiveStoreId) && (
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={handleLogoClick}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                  isLight
                    ? "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                    : "bg-white/10 border border-white/15 text-white hover:bg-white/20"
                }`}
              >
                <ArrowLeft size={16} />
              </motion.button>
            )}
            <div
              className={`shrink-0 flex items-center gap-1.5 sm:gap-2 group ${!exclusiveStoreId ? "cursor-pointer" : ""}`}
              onClick={handleLogoClick}
            >
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${logoBgClass}`}>
                <span className="font-black text-sm sm:text-lg">C</span>
              </div>
              <span className={`text-base sm:text-xl font-extrabold tracking-tight hidden xs:block ${textColorClass}`}>
                CapiMercado
              </span>
            </div>
          </div>

          {/* 2. Desktop Search (Solo en variante 'full') */}
          {variant === "full" && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isLight ? "text-slate-400" : "text-slate-400"}`} />
                <input
                  type="text"
                  placeholder={`Buscar ${searchType === "products" ? "iPhone, Sony..." : "tiendas..."}`}
                  className={`w-full rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 transition-all outline-none ${
                    isLight
                      ? "bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-slate-300"
                      : "bg-white/10 border border-white/15 text-white placeholder:text-white/50 focus:ring-white/20"
                  }`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                />
                {searchTerm && setSearchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            {variant === "full" && !exclusiveStoreId && (
              <>
                <button
                  onClick={() => {
                    if (setSearchType) setSearchType("stores");
                    if (onResetStore) onResetStore();
                    scrollToCatalog();
                  }}
                  className={`text-sm font-semibold transition-colors cursor-pointer ${
                    searchType === "stores" && !activeStore
                      ? textColorClass
                      : isLight
                        ? "text-slate-500 hover:text-slate-900"
                        : "text-white/60 hover:text-white"
                  }`}
                >
                  Directorio
                </button>
                <button
                  onClick={() => {
                    if (setSearchType) setSearchType("products");
                    scrollToCatalog();
                  }}
                  className={`text-sm font-semibold transition-colors cursor-pointer ${
                    searchType === "products" || activeStore
                      ? textColorClass
                      : isLight
                        ? "text-slate-500 hover:text-slate-900"
                        : "text-white/60 hover:text-white"
                  }`}
                >
                  Mercado
                </button>
              </>
            )}

            {isAuthenticated ? (
              <button
                onClick={() => navigate("/account")}
                className={`flex items-center gap-2 text-sm font-bold transition-all px-4 py-2 rounded-lg border shadow-xs cursor-pointer ${
                  isLight
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-200"
                    : "bg-white/10 text-white hover:text-emerald-400 border-white/10"
                }`}
              >
                <User size={16} /> Mi Cuenta
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className={`text-sm font-bold px-6 py-2 rounded-full transition-colors shadow-md cursor-pointer ${
                  isLight
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-white text-[#050505] hover:bg-slate-200"
                }`}
              >
                Ingresar
              </button>
            )}
          </div>

          {/* 4. Mobile Right side */}
          <div className="md:hidden flex items-center gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => {
                  navigate("/auth");
                  if (setIsMenuOpen) setIsMenuOpen(false);
                }}
                className={`text-xs font-bold px-4 py-1.5 rounded-full cursor-pointer ${
                  isLight ? "bg-slate-900 text-white" : "bg-white text-[#050505]"
                }`}
              >
                Ingresar
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/account");
                  if (setIsMenuOpen) setIsMenuOpen(false);
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border cursor-pointer ${
                  isLight
                    ? "bg-slate-100 text-slate-900 border-slate-200"
                    : "bg-white/10 text-white border-white/20"
                }`}
              >
                <User size={13} /> Cuenta
              </button>
            )}

            {variant === "full" && setIsMenuOpen && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1 ml-1 cursor-pointer ${textColorClass}`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5. Mobile Menu Content (Solo si variant === "full") */}
      {variant === "full" && isMenuOpen && (
        <div className={`md:hidden px-3 py-4 space-y-3 shadow-xl backdrop-blur-xl border-t ${
          isLight ? "bg-white/95 border-slate-200" : "bg-[#050505]/95 border-white/10"
        }`}>
          {!exclusiveStoreId && (
            <div className={`flex gap-1.5 p-1 rounded-xl ${isLight ? "bg-slate-100" : "bg-white/10"}`}>
              <button
                onClick={() => {
                  if (setSearchType) setSearchType("products");
                  if (setIsMenuOpen) setIsMenuOpen(false);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  searchType === "products"
                    ? "bg-white text-slate-900 shadow-xs"
                    : isLight
                      ? "text-slate-600"
                      : "text-white/70"
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => {
                  if (setSearchType) setSearchType("stores");
                  if (setIsMenuOpen) setIsMenuOpen(false);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  searchType === "stores"
                    ? "bg-white text-slate-900 shadow-xs"
                    : isLight
                      ? "text-slate-600"
                      : "text-white/70"
                }`}
              >
                Tiendas
              </button>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="¿Qué buscas hoy?"
              className={`w-full rounded-full py-2.5 pl-10 pr-4 outline-none text-sm ${
                isLight
                  ? "bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400"
                  : "bg-white/10 border border-white/15 text-white placeholder:text-white/50"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
    </nav>
  );
}