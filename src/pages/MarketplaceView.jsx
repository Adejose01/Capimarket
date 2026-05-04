import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Search, ArrowLeft, X, Plus, Filter, MapPin, MessageCircle, ChevronRight, User, Menu
} from 'lucide-react';
import pb from '../lib/pocketbase';
import { getImageUrl, formatWhatsAppNumber, SPRING, SPRING_SLOW, getCategoryIcon } from '../lib/utils';
import useAuthStore from '../store/useAuthStore';
import SafeImage from '../components/SafeImage';
import HeroCinematic from '../components/HeroCinematic';
import CategoryBentoGrid from '../components/CategoryBentoGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductGrid from '../components/marketplace/ProductGrid';
import PriceDisplay from '../components/PriceDisplay';
import useDebounce from '../hooks/useDebounce';

const IconInstagram = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const IconFacebook = ({ size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

export default function MarketplaceView({ exclusiveStoreId = null, exclusiveStoreSlug = null }) {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const [products, setProducts] = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);



  // Buscador y Filtros
  const [searchType, setSearchType] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Filtros Pro
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterCond, setFilterCond] = useState('all');
  const [filterLoc, setFilterLoc] = useState('all');
  const [sortOrder, setSortOrder] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const catalogRef = useRef(null);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Carga inicial de datos y manejo de slugs exclusivos
  useEffect(() => {
    const init = async () => {
      try {
        const [cats, strs] = await Promise.all([
          pb.collection('categories').getFullList(),
          pb.collection('stores').getFullList()
        ]);
        setCategories(cats);
        setStores(strs);

        // Si hay slug/id exclusivo, cargar esa tienda
        if (exclusiveStoreSlug) {
          const st = await pb.collection('stores').getFirstListItem(`slug="${exclusiveStoreSlug}"`);
          setActiveStore(st);
          setSearchType('products');
        } else if (exclusiveStoreId) {
          const st = await pb.collection('stores').getOne(exclusiveStoreId);
          setActiveStore(st);
          setSearchType('products');
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    init();
  }, [exclusiveStoreId, exclusiveStoreSlug]);

  // Auto-scroll al buscar
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [debouncedSearchTerm]);

  // Carga de productos Paginada y Filtrada
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let filterParams = 'store.status = "approved" && listed = true';
        
        if (exclusiveStoreId) {
           filterParams += ` && store = "${exclusiveStoreId}"`;
        } else if (activeStore) {
           filterParams += ` && store = "${activeStore.id}"`;
        }

        if (debouncedSearchTerm) {
           filterParams += ` && (name ~ "${debouncedSearchTerm}" || brand ~ "${debouncedSearchTerm}")`;
        }
        if (activeCategory && activeCategory !== 'Todos') {
           const selectedCat = categories.find(c => c.name === activeCategory);
           if (selectedCat) {
             if (!selectedCat.parent_id) {
               // Búsqueda recursiva: categoría raíz o hijos de esta raíz
               filterParams += ` && (category = "${selectedCat.id}" || category.parent_id = "${selectedCat.id}")`;
             } else {
               filterParams += ` && category = "${selectedCat.id}"`;
             }
           }
        }
        if (minPrice !== '') {
           filterParams += ` && price >= ${Number(minPrice) * 100}`;
        }
        if (maxPrice !== '') {
           filterParams += ` && price <= ${Number(maxPrice) * 100}`;
        }
        if (filterCond && filterCond !== 'all') {
           filterParams += ` && condition = "${filterCond}"`;
        }
        if (filterLoc && filterLoc !== 'all') {
           filterParams += ` && store.location = "${filterLoc}"`;
        }

        const productsRecord = await pb.collection('products').getList(currentPage, 20, {
          expand: 'store,category',
          filter: filterParams,
          ...(sortOrder ? { sort: sortOrder } : {})
        });

        setProducts(productsRecord.items);
        setTotalPages(productsRecord.totalPages);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [currentPage, debouncedSearchTerm, activeStore, activeCategory, minPrice, maxPrice, filterCond, filterLoc, sortOrder, exclusiveStoreId]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeStore, activeCategory, minPrice, maxPrice, filterCond, filterLoc, sortOrder]);

  // Listas Dinámicas — Solo mostramos los Rubros (Categorías Raíz) en la barra superior
  const availableCategories = useMemo(() => {
    if (!categories || categories.length === 0) return ['Todos'];
    const roots = categories.filter(c => !c.parent_id).map(c => c.name);
    const list = ['Todos', ...roots];
    
    // Si hay una categoría activa que es subcategoría (ej: desde Bento Grid), la incluimos para que se vea seleccionada
    if (activeCategory !== 'Todos' && !list.includes(activeCategory)) {
       list.push(activeCategory);
    }
    return list;
  }, [categories, activeCategory]);

  const availableLocations = ['all', ...new Set(stores?.map(s => s.location).filter(Boolean))];

  const filteredStores = useMemo(() => stores.filter(store => {
    // Normalize store categories to always be an array of IDs
    const storeCatIds = Array.isArray(store.category) ? store.category : (store.category ? [store.category] : []);
    
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         storeCatIds.some(catId => {
                           const cat = categories.find(c => c.id === catId);
                           return cat && cat.name.toLowerCase().includes(searchTerm.toLowerCase());
                         });
    
    const matchesCategory = activeCategory === 'Todos' || storeCatIds.some(catId => {
      const cat = categories.find(c => c.id === catId);
      if (!cat) return false;
      const selectedCat = categories.find(c => c.name === activeCategory);
      return cat.id === selectedCat?.id || cat.parent_id === selectedCat?.id;
    });

    return store.status === 'approved' && matchesSearch && matchesCategory;
  }), [stores, searchTerm, activeCategory, categories]);

  const filteredProducts = products;

  const handleApplyToSell = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    if (name) {
      const generatedSlug = name.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      fd.append('slug', generatedSlug);
    }
    fd.append('status', 'pending');
    try {
      await pb.collection('stores').create(fd);
      toast.success('¡Solicitud enviada con éxito!');
      setShowApplyModal(false);
    } catch (err) {
      toast.error('Hubo un error enviando tu solicitud.');
    }
  };



  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-slate-200 flex flex-col">

      {/* --- NAVBAR --- */}
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
                  onClick={() => { setActiveStore(null); setSearchType('products'); setActiveCategory('Todos'); navigate('/'); }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
                >
                  <ArrowLeft size={16} />
                </motion.button>
              )}
              <div
                className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 group ${!exclusiveStoreId ? 'cursor-pointer' : ''}`}
                onClick={() => { setActiveStore(null); setSearchType('products'); setSearchTerm(''); setActiveCategory('Todos'); navigate('/'); }}
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-md sm:rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="text-[#050505] font-black text-sm sm:text-lg">C</span>
                </div>
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-white hidden xs:block">CapiMercado</span>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Buscar ${searchType === 'products' ? 'iPhone, Sony...' : 'tiendas...'}`}
                  className="w-full bg-white/10 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white/15 focus:border-white/20 transition-all outline-none text-white placeholder:text-white/40 shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setDebouncedSearchTerm(searchTerm);
                    }
                  }}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3 text-slate-400 hover:text-white transition-colors">
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
                    onClick={() => { setSearchType('stores'); setActiveStore(null); setActiveCategory('Todos'); setSearchTerm(''); setDebouncedSearchTerm(''); }}
                    className={`text-sm font-semibold transition-colors ${searchType === 'stores' && !activeStore ? 'text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    Directorio
                  </button>
                  <button
                    onClick={() => { setSearchType('products'); setActiveCategory('Todos'); setSearchTerm(''); setDebouncedSearchTerm(''); }}
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
                <button onClick={() => { setSearchType('products'); setActiveCategory('Todos'); setSearchTerm(''); setDebouncedSearchTerm(''); setIsMenuOpen(false); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${searchType === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70'}`}>Productos</button>
                <button onClick={() => { setSearchType('stores'); setActiveStore(null); setActiveCategory('Todos'); setSearchTerm(''); setDebouncedSearchTerm(''); setIsMenuOpen(false); }} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${searchType === 'stores' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/70'}`}>Tiendas</button>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setDebouncedSearchTerm(searchTerm);
                  }
                }}
              />
            </div>
          </div>
        )}
      </nav>

      {/* --- MODAL SOLICITUD TIENDA --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Conviértete en Aliado</h3>
            <p className="text-slate-500 text-sm mb-6">Únete al mercado líder. Completa tus datos y te contactaremos para verificar tu tienda.</p>

            <form onSubmit={handleApplyToSell} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">Nombre de tu Tienda</label>
                <input name="name" type="text" required placeholder="Ej: TechStore C.A." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">Usuario en Instagram</label>
                <input name="instagram" type="text" placeholder="@tutienda" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">WhatsApp de Ventas</label>
                  <input name="whatsapp" type="text" required placeholder="58414..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">Correo de Contacto</label>
                  <input name="email" type="email" required placeholder="tu@correo.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 transition-colors shadow-lg">
                Enviar Solicitud
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">¿Ya tienes cuenta de vendedor? </span>
              <button onClick={() => navigate('/panel')} className="text-xs font-bold text-slate-900 hover:underline">Ingresar al Panel</button>
            </div>
          </div>
        </div>
      )}


      <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 22 }} className="flex-grow" style={{ willChange: "transform" }}>
        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-green rounded-full animate-spin mb-4 mx-auto"></div>
             <p className="text-xl font-bold text-slate-900">CapiMercado: Preparando vitrinas...</p>
          </div>
        ) : (<>

        {/* --- HERO SECTION --- */}
        <section className="mb-0">
          {activeStore ? (
            <div
              className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-end md:items-center shadow-lg transition-all duration-500 mt-0"
              style={{
                backgroundColor: activeStore.primaryColor || '#0f172a',
                backgroundImage: activeStore.banner ? `url(${getImageUrl(activeStore, activeStore.banner, '1200x400')})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {activeStore.banner && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>}

              <div className="relative z-10 px-8 pt-24 pb-10 md:px-16 md:pt-28 w-full max-w-3xl text-white flex flex-col items-center md:items-start">
                {!exclusiveStoreId && (
                  <button onClick={() => setActiveStore(null)} className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity">
                    <ArrowLeft size={14} /> Volver al mercado
                  </button>
                )}

                {activeStore.logo && (
                  <SafeImage
                    src={getImageUrl(activeStore, activeStore.logo, '200x200')}
                    alt={activeStore.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 shadow-xl border-4 border-white transform -translate-y-[25%] object-cover"
                  />
                )}

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight tracking-tight text-center md:text-left flex items-center justify-center md:justify-start gap-3">
                  {activeStore.name}
                  {activeStore.instagram && (
                    <a href={`https://instagram.com/${activeStore.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#fd5949] to-[#d6249f] hover:scale-110 transition-transform shadow-lg">
                      <IconInstagram size={16} className="text-white" />
                    </a>
                  )}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                  {activeStore.category && Array.isArray(activeStore.category) && activeStore.category.map(catId => {
                    const cat = categories.find(c => c.id === catId);
                    if (!cat) return null;
                    const Icon = getCategoryIcon(cat.name);
                    return (
                      <span key={catId} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                        <Icon size={12} /> {cat.name}
                      </span>
                    );
                  })}
                  {!Array.isArray(activeStore.category) && activeStore.category && (
                     <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                       {activeStore.category}
                     </span>
                  )}
                  {activeStore.location && (
                    <span className="flex items-center gap-2">
                      <MapPin size={12} /> {activeStore.location}
                      {activeStore.maps_url && (
                        <a href={activeStore.maps_url} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[9px] font-extrabold hover:bg-emerald-400 transition-colors">
                          VER EN MAPS
                        </a>
                      )}
                    </span>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  {activeStore.verified && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                      ✓ Tienda Verificada
                    </span>
                  )}
                  {activeStore.created && (
                    <span className="text-white/50 text-xs font-medium">
                      Miembro desde {new Date(activeStore.created).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>

                {activeStore.description && (
                  <p className="text-white text-sm md:text-base mt-5 opacity-90 text-center md:text-left leading-relaxed">
                    {activeStore.description}
                  </p>
                )}

                <div className="flex justify-center md:justify-start gap-4 mt-6">
                  {/* Instagram link movido al header */}
                  {activeStore.facebook && (
                    <a href={activeStore.facebook.startsWith('http') ? activeStore.facebook : `https://facebook.com/${activeStore.facebook}`} target="_blank" rel="noreferrer" className="text-white hover:text-blue-400 transition bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md">
                      <IconFacebook size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <HeroCinematic onExplore={() => document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' })} />
          )}
        </section>

        {/* --- BENTO CATEGORY GRID (solo cuando no hay tienda activa y estamos en productos) --- */}
        {!activeStore && searchType === 'products' && (
          <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-16 sm:mb-20">
            <CategoryBentoGrid categories={categories} onSelectCategory={(cat) => { setActiveCategory(cat); document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' }); }} />
          </section>
        )}

        {/* --- FILTER CHIPS: Sticky Horizontal Bar --- */}
        <section className="sticky top-0 z-40 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm mb-8 sm:mb-12 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar py-3 sm:py-4">
            <div className="flex gap-2 sm:gap-3">
              {availableCategories?.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => { setActiveCategory(cat); document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  className={`whitespace-nowrap px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors duration-300 ${activeCategory === cat
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* --- DYNAMIC GRID --- */}
        <section id="catalogo" ref={catalogRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[40vh] scroll-mt-20 pb-32 sm:pb-20">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {searchType === 'stores' && !activeStore ? 'Directorio de Tiendas' : 'Catálogo de Productos'}
            </h2>
            {searchType === 'products' && (
              <div className="flex items-center gap-2">
                {/* Sort Order Selector */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="text-xs sm:text-sm font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 outline-none cursor-pointer text-slate-700 shadow-sm"
                >
                  <option value="">⏱ Más recientes</option>
                  <option value="price">💰 Precio: menor a mayor</option>
                  <option value="-price">💰 Precio: mayor a menor</option>
                  <option value="name">🔤 Nombre A-Z</option>
                </select>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium transition-colors px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg ${showFilters ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filtros
                </button>
              </div>
            )}
          </div>

          {/* ===== APPLIED FILTER CHIPS ===== */}
          {searchType === 'products' && (activeCategory !== 'Todos' || minPrice || maxPrice || filterCond !== 'all' || filterLoc !== 'all' || debouncedSearchTerm) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {debouncedSearchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                  🔍 "{debouncedSearchTerm}"
                  <button onClick={() => { setSearchTerm(''); setDebouncedSearchTerm(''); }} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                </span>
              )}
              {activeCategory !== 'Todos' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                  📂 {activeCategory}
                  <button onClick={() => setActiveCategory('Todos')} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                </span>
              )}
              {filterCond !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                  {filterCond === 'new' ? '✨ Nuevo' : filterCond === 'open_box' ? '📂 Open Box' : '📦 Usado'}
                  <button onClick={() => setFilterCond('all')} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                </span>
              )}
              {minPrice && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                  Min: ${minPrice}
                  <button onClick={() => setMinPrice('')} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                </span>
              )}
              {maxPrice && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                  Max: ${maxPrice}
                  <button onClick={() => setMaxPrice('')} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                </span>
              )}
              {filterLoc !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm">
                  📍 {filterLoc}
                  <button onClick={() => setFilterLoc('all')} className="ml-1 hover:text-red-300 transition-colors">✕</button>
                </span>
              )}
              <button onClick={() => { setActiveCategory('Todos'); setMinPrice(''); setMaxPrice(''); setFilterCond('all'); setFilterLoc('all'); setSearchTerm(''); setDebouncedSearchTerm(''); }} className="text-xs font-bold text-slate-500 hover:text-red-600 underline ml-1 transition-colors">
                Limpiar todo
              </button>
            </div>
          )}

          {/* --- PRO FILTERS PANEL --- */}
          {searchType === 'products' && showFilters && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-4 sm:mb-8 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">Precio Mín.</label>
                  <input type="number" placeholder="$0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400" />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">Precio Máx.</label>
                  <input type="number" placeholder="$9999" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400" />
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">Condición</label>
                  <select value={filterCond} onChange={(e) => setFilterCond(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer">
                    <option value="all">Cualquiera</option>
                    <option value="new">✨ Nuevo</option>
                    <option value="open_box">📂 Open Box</option>
                    <option value="used">📦 Usado</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 sm:mb-2 block">Ubicación</label>
                  <select value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer">
                    {availableLocations.map(loc => (
                      <option key={loc} value={loc}>{loc === 'all' ? 'Todas' : loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex justify-end">
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); setFilterCond('all'); setFilterLoc('all'); }} className="text-xs font-bold text-slate-500 hover:text-slate-900 underline">Limpiar</button>
              </div>
            </div>
          )}

          {/* RENDERING STORES */}
          {searchType === 'stores' && !activeStore && (
            <div className="space-y-6">
              {/* Category filter notice */}
              {activeCategory !== 'Todos' && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Mostrando tiendas de:</span>
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-bold">{activeCategory}</span>
                  <button onClick={() => setActiveCategory('Todos')} className="text-xs underline hover:text-slate-900">Ver todas</button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores?.map(s => (
                  <div
                    key={s.id}
                    onClick={() => { navigate(`/stores/${s.slug || s.id}`); }}
                    className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer flex items-center gap-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2.5" style={{ backgroundColor: s.primaryColor || '#0f172a' }}></div>

                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black bg-slate-50 text-slate-900 overflow-hidden z-10 border border-slate-100">
                      {s.logo ? (
                        <SafeImage src={getImageUrl(s, s.logo, '100x100')} alt={s.name} className="w-full h-full" />
                      ) : (
                        s.name.charAt(0)
                      )}
                    </div>
                    <div className="z-10 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-bold text-lg text-slate-900 tracking-tight leading-none">{s.name}</h5>
                        {s.verified && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-extrabold uppercase">✓</span>
                        )}
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {(() => {
                          const catIds = Array.isArray(s.category) ? s.category : (s.category ? [s.category] : []);
                          if (catIds.length === 0) {
                            return (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                Sin categoría
                              </span>
                            );
                          }
                          return catIds.slice(0, 3).map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            if (!cat) return null;
                            const Icon = getCategoryIcon(cat.name);
                            return (
                              <span key={catId} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Icon size={10} /> {cat.name}
                              </span>
                            );
                          });
                        })()}
                        {s.location && <span className="text-xs font-medium text-slate-400">• {s.location}</span>}
                      </div>
                    </div>
                    <ChevronRight className="ml-auto text-slate-300 group-hover:text-slate-900 transition-colors group-hover:translate-x-1 z-10" />
                  </div>
                ))}
              </div>
              {filteredStores?.length === 0 && (
                <div className="py-16 text-center">
                  <p className="text-lg font-bold text-slate-400">No se encontraron tiendas{activeCategory !== 'Todos' ? ` en la categoría "${activeCategory}"` : ''}.</p>
                </div>
              )}
            </div>
          )}

          {/* RENDERING PRODUCTS */}
          {searchType === 'products' && (
            <>
              <ProductGrid 
                products={filteredProducts} 
                isLoading={isLoading} 
                activeStoreName={activeStore ? activeStore.name : null}
                getImageUrl={getImageUrl}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
              />
            </>
          )}
        </section>
      </>)}</motion.main>

      <Footer />
    </div>
  );
}
