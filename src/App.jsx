import React, { useState, useEffect, useMemo } from 'react';
import PocketBase from 'pocketbase';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Search, Store, Smartphone, Laptop, Headphones,
  ShieldAlert, Package, LogOut, ArrowLeft,
  CheckCircle2, Lock, LayoutGrid, ChevronRight,
  MessageCircle, X, Plus, Trash2, TrendingUp,
  Activity, Key, Image as ImageIcon, UploadCloud, Palette,
  Menu, Filter, Settings, MapPin, Edit2, User, Mail, ArrowRight
} from 'lucide-react';
import StoreCatalogView from './pages/StoreCatalogView';
import ProductCard from './components/ProductCard';
import PriceDisplay from './components/PriceDisplay';

// ============================================================================
// CONFIGURACIÓN GLOBAL, HELPERS E ICONOS CUSTOM
// ============================================================================
// 1. Ajuste del SDK: Nginx se encarga del enrutamiento sin necesidad del puerto 8090
const pb = new PocketBase('http://localhost:8090');

const IconInstagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);

const IconFacebook = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
);

const getImageUrl = (record, filename, thumb = '0x0') => {
  if (!record || !filename) return null;
  return pb.files.getURL(record, filename, { thumb });
};

// 5. Lógica de Contacto (Limpiador WhatsApp High-End)
const formatWhatsAppNumber = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, ''); // Eliminar caracteres no numéricos
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1); // Quitar '0' inicial si existe
  if (!cleaned.startsWith('58')) cleaned = '58' + cleaned; // Forzar prefijo 58
  return cleaned;
};

function SafeImage({ src, alt, className, fallbackIcon = <ImageIcon size={32} /> }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}


// ============================================================================
// SPRING ANIMATION PHYSICS — Pilar 3 (config compartida)
// ============================================================================
const SPRING = { type: 'spring', stiffness: 300, damping: 22 };
const SPRING_SLOW = { type: 'spring', stiffness: 180, damping: 18 };

// ============================================================================
// HERO CINEMATOGRAFICO — Pilar 1
// ============================================================================
function HeroCinematic({ onExplore }) {
  return (
    <section className="relative overflow-hidden bg-[#050505] w-full min-h-[100svh] sm:min-h-[640px] md:min-h-[720px] flex items-end sm:items-center">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 60% at 18% 50%, rgba(16,185,129,0.28), transparent 65%), radial-gradient(ellipse 60% 80% at 82% 30%, rgba(99,102,241,0.18), transparent 60%)' }} />
      {/* Top gradient: ensures navbar logo/text always visible */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent z-[5] pointer-events-none" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-20 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-0">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING_SLOW, delay: 0.1 }} className="flex flex-col gap-4 sm:gap-6 text-center md:text-left">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="inline-flex items-center gap-2 self-center md:self-start px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-extrabold uppercase tracking-widest text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-green animate-pulse inline-block" />
            Nueva Coleccion 2026
          </motion.span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white leading-[0.92] italic">
            Tecnologia<br />
            <span className="not-italic text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#10b981,#34d399)' }}>de Lujo.</span>
          </h1>
          <p className="text-sm text-white/50 max-w-xs mx-auto md:mx-0 leading-relaxed font-medium">El ecosistema premium de tecnologia de Venezuela. Marcas certificadas, precios transparentes.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING} onClick={onExplore} className="self-center md:self-start flex items-center gap-3 bg-white text-[#050505] px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-shadow">
            Explorar Ahora <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
        <div className="relative flex items-end justify-center h-[180px] sm:h-[320px] md:h-[400px]">
          <div className="hero-ground-shadow absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-8 sm:h-10" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_SLOW, delay: 0.3 }} className="animate-float absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-[260px] sm:max-w-[320px]">
            <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=90&w=900" alt="Luxury Tech" className="hero-float w-full h-full object-contain select-none" draggable={false} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING, delay: 0.65 }} className="glass-card absolute top-3 right-3 sm:top-6 sm:right-6 rounded-xl sm:rounded-2xl px-4 py-3 flex flex-col">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Disponible</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">+500 Items</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BENTO BOX CATEGORIAS — Pilar 2
// ============================================================================
const CATEGORY_BENTO = [
  { label: 'Smartphones', icon: Smartphone, span: 'col-span-2 row-span-2', gradient: 'from-slate-900 to-slate-700', text: 'text-white' },
  { label: 'Laptops', icon: Laptop, span: 'col-span-1 row-span-1', gradient: 'from-indigo-50 to-indigo-100', text: 'text-indigo-900' },
  { label: 'Audio', icon: Headphones, span: 'col-span-1 row-span-1', gradient: 'from-emerald-50 to-emerald-100', text: 'text-emerald-900' },
  { label: 'Accesorios', icon: Package, span: 'col-span-2 row-span-1', gradient: 'from-amber-50 to-orange-100', text: 'text-amber-900' },
];
// NOTA: Estas etiquetas deben coincidir con el campo "category" de la coleccion
// "stores" en PocketBase. MarketplaceView filtra products segun store.category.

function CategoryBentoGrid({ onSelectCategory, categories }) {
  // Use dynamic categories from DB, fallback to CATEGORY_BENTO if empty
  const displayCategories = (categories && categories.length > 0)
    ? categories.map(cat => {
        const fallback = CATEGORY_BENTO.find(b => b.label.toLowerCase() === cat.name.toLowerCase()) || { gradient: 'from-slate-100 to-slate-200', text: 'text-slate-900', icon: Package };
        return {
          label: cat.name,
          icon: fallback.icon,
          span: cat.span || 'col-span-1 row-span-1',
          gradient: cat.gradient || fallback.gradient,
          text: cat.textColor || fallback.text
        };
      })
    : CATEGORY_BENTO;

  return (
    <section>
      <div className="flex items-center justify-between mb-5 sm:mb-7">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Por categoría</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 auto-rows-[90px] sm:auto-rows-[120px] gap-2.5 sm:gap-4">
        {displayCategories?.map(({ label, icon: Icon, span, gradient, text }) => (
          <motion.button key={label} whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.97 }} transition={SPRING} onClick={() => onSelectCategory(label)}
            className={`${span} bg-gradient-to-br ${gradient} rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-end text-left overflow-hidden relative group shadow-sm`}>
            <Icon className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${text} opacity-10 group-hover:opacity-25 transition-opacity`} size={44} />
            <span className={`text-base sm:text-2xl font-extrabold tracking-tight ${text} leading-none`}>{label}</span>
            <span className={`text-[9px] sm:text-xs font-extrabold mt-1 ${text} opacity-50 uppercase tracking-widest`}>Ver todo</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// ENRUTADOR PRINCIPAL (2. Mapa de Rutas)
// ============================================================================
export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#/') return <MarketplaceView />;
  if (route === '#/auth') return <AuthView />;
  if (route === '#/mi-cuenta') return <BuyerPortalView />;
  // Vista de Tienda Exclusiva estilo Linktree (#/stores/[id])
  if (route.startsWith('#/stores/')) {
    const storeSlug = route.split('#/stores/')[1];
    return <StoreCatalogView storeSlug={storeSlug} onSelectProduct={(p) => { }} />;
  }
  // Mantener compatibilidad con #/store/ del Marketplace si se requiere
  if (route.startsWith('#/store/')) {
    const storeSlug = route.split('#/store/')[1];
    return <MarketplaceView exclusiveStoreSlug={storeSlug} />;
  }
  if (route.startsWith('#/panel')) return <SellerPortalView />;
  if (route.startsWith('#/admin-control-valencia-2026')) return <SuperAdminView />;

  return <MarketplaceView />;
}

// ============================================================================
// 1.5 VISTA DE AUTENTICACIÓN (LOGIN / REGISTRO)
// ============================================================================
function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir si ya está logueado
  useEffect(() => {
    if (pb.authStore.isValid) {
      window.location.hash = '#/';
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await pb.collection('users').authWithPassword(email, password);
        window.location.hash = '#/';
        window.location.reload();
      } else {
        if (password.length < 8) {
          alert("❌ La contraseña debe tener al menos 8 caracteres.");
          setIsLoading(false);
          return;
        }
        if (password !== passwordConfirm) {
          alert("❌ Las contraseñas no coinciden.");
          setIsLoading(false);
          return;
        }

        await pb.collection('users').create({
          email,
          password,
          passwordConfirm,
          name
        });
        await pb.collection('users').authWithPassword(email, password);
        window.location.hash = '#/';
        window.location.reload();
      }
    } catch (err) {
      console.error('Error exacto de PB:', err.response?.data?.data);
      console.error('Error completo:', err);
      const pbError = err.response?.data || {};

      if (pbError.name) {
        alert("❌ Error en el nombre: " + pbError.name.message);
      } else if (pbError.email) {
        alert("❌ Error en el correo: " + pbError.email.message);
      } else if (pbError.password) {
        alert("❌ Error en la contraseña: " + pbError.password.message);
      } else if (pbError.passwordConfirm) {
        alert("❌ Error en la confirmación: " + pbError.passwordConfirm.message);
      } else {
        alert("⚠️ Error del servidor: " + JSON.stringify(err.response));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-slate-200">
      <div className="w-full max-w-md">
        <button onClick={() => window.location.hash = '#/'} className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={14} /> Volver al Marketplace
        </button>

        <div className="bg-white dark:bg-[#0a0a0a] p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
            <span className="text-white font-bold text-2xl">C</span>
          </div>

          <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
            {isLogin ? 'Bienvenido de vuelta.' : 'Crea tu cuenta.'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mb-8">
            {isLogin ? 'Ingresa tus datos para continuar en CapiMercado.' : 'Únete al ecosistema de tecnología de lujo más grande.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Nombre Completo</label>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Correo Electrónico</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Contraseña</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
            </div>
            {!isLogin && (
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">Confirmar Contraseña</label>
                <input required type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium" />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all mt-4 disabled:opacity-50 shadow-md">
              {isLoading ? 'Cargando...' : (isLogin ? 'Ingresar a mi cuenta' : 'Registrarme')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
            <button onClick={() => setIsLogin(!isLogin)} className="text-xs font-bold text-slate-900 hover:underline px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 1.8 VISTA COMPRADOR (PANEL BÁSICO)
// ============================================================================
function BuyerPortalView() {
  const [user, setUser] = useState(null);
  const [myStores, setMyStores] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      window.location.hash = '#/auth';
    } else {
      setUser(pb.authStore.model);
      pb.collection('stores').getFullList({ filter: `owner = "${pb.authStore.model.id}"` })
        .then(setMyStores)
        .catch(() => setMyStores([]));
    }
  }, []);

  if (!pb.authStore.isValid) return null;

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
    fd.append('owner', pb.authStore.model.id);
    try {
      await pb.collection('stores').create(fd);
      alert('¡Solicitud enviada con éxito! El equipo de CapiMercado se contactará contigo pronto.');
      setShowApplyModal(false);
    } catch (err) {
      console.error(err);
      alert('Hubo un error enviando tu solicitud.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-200 flex flex-col">
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Conviértete en Aliado</h3>
            <p className="text-slate-500 text-sm mb-6">Completa tus datos y te contactaremos para verificar tu tienda.</p>

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
          </div>
        </div>
      )}

      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.hash = '#/'}>
              <ArrowLeft className="text-slate-400 hover:text-slate-900 transition-colors" />
              <span className="font-bold tracking-tight">Volver a Tienda</span>
            </div>
            <button onClick={() => { pb.authStore.clear(); window.location.hash = '#/'; }} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-xl">
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 flex-grow max-w-3xl mx-auto w-full px-4">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{user.name || 'Usuario CapiMercado'}</h1>
            <p className="text-sm font-medium text-slate-500">{user.email}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-white text-xs font-bold uppercase tracking-wider text-slate-800 rounded-md border border-slate-200">
              Cuenta Comprador
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors cursor-pointer group flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Lock size={16} /> Seguridad y Contraseña</h3>
              <p className="text-sm text-slate-500 mt-1">Actualiza tus credenciales de acceso</p>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-slate-900 transition-colors px-2" />
          </div>

          {myStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => window.location.hash = '#/panel'} className="p-6 border border-slate-900 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center gap-3">
                <Settings size={28} className="text-slate-900 group-hover:rotate-90 transition-transform duration-500" />
                <h3 className="font-bold text-slate-900">Administrar mis Tiendas</h3>
                <p className="text-xs text-slate-500">Ingresa al panel de control de tus negocios actuales.</p>
              </button>
              <button onClick={() => setShowApplyModal(true)} className="p-6 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors cursor-pointer group flex flex-col items-center justify-center text-center gap-3">
                <Store className="text-slate-400 w-8 h-8 group-hover:text-slate-600 transition-colors" />
                <h3 className="font-bold text-slate-900">Crear nueva Tienda</h3>
                <p className="text-xs text-slate-500">Solicita abrir otra sucursal u otra marca.</p>
              </button>
            </div>
          ) : (
            <div className="p-6 border border-slate-100 rounded-2xl flex flex-col justify-center items-center text-center bg-slate-50 gap-3 hover:border-slate-300 transition-colors cursor-pointer" onClick={() => setShowApplyModal(true)}>
              <Store className="text-slate-300 w-8 h-8" />
              <p className="font-bold text-slate-700">Crear mi Tienda / Quiero Vender</p>
              <p className="text-xs text-slate-500 max-w-sm mb-2">Si eres una tienda de tecnología y deseas publicar aquí, envía tu solicitud para ser revisada.</p>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">
                Aplicar para Vender
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// 1. VISTA PÚBLICA (E-COMMERCE HIGH-END)
// ============================================================================
function MarketplaceView({ exclusiveStoreId = null, exclusiveStoreSlug = null }) {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeStore, setActiveStore] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Detalle del Producto
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

  // Buscador y Filtros
  const [searchType, setSearchType] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Filtros Pro
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [filterCond, setFilterCond] = useState('all');
  const [filterLoc, setFilterLoc] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const categoriesRecord = await pb.collection('categories').getFullList();
        setCategories(categoriesRecord);
        if (exclusiveStoreSlug) {
          const storeRecord = await pb.collection('stores').getFirstListItem(`slug="${exclusiveStoreSlug}"`);
          const productsRecord = await pb.collection('products').getFullList({
            filter: `store = "${storeRecord.id}"`,
            expand: 'store,category'
          });
          setActiveStore(storeRecord);
          setStores([storeRecord]);
          setProducts([]); // reset
          setTimeout(() => {
             setProducts(productsRecord);
             window.scrollTo(0, 0);
          }, 50);
          setSearchType('products');
        } else if (exclusiveStoreId) {
          // Filtro Absoluto para compartir tienda directa
          const storeRecord = await pb.collection('stores').getOne(exclusiveStoreId);
          const productsRecord = await pb.collection('products').getFullList({
            filter: `store = "${exclusiveStoreId}"`,
            expand: 'store'
          });
          setActiveStore(storeRecord);
          setStores([storeRecord]);
          setProducts(productsRecord);
          setSearchType('products');
        } else {
          // Marketplace General
          const [storesRecord, productsRecord] = await Promise.all([
            pb.collection('stores').getFullList(),
            pb.collection('products').getFullList({ expand: 'store' })
          ]);
          setStores(storesRecord);
          setProducts(productsRecord);
        }
      } catch (error) {
        console.error('Error exacto de PB:', error.response?.data?.data);
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [exclusiveStoreId, exclusiveStoreSlug]);

  // Listas Dinámicas
  const availableCategories = ['Todos', ...new Set(stores?.map(s => s.category).filter(Boolean))];
  const availableLocations = ['all', ...new Set(stores?.map(s => s.location).filter(Boolean))];

  const filteredStores = useMemo(() => stores.filter(store =>
    store.status === 'approved' &&
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeCategory === 'Todos' || store.category === activeCategory)
  ), [stores, searchTerm, activeCategory]);

  const filteredProducts = useMemo(() => products.filter(p => {
    const isApproved = p.expand?.store?.status === 'approved';
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.expand?.store?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = activeStore ? p.store === activeStore.id : true;
    const matchesCategory = activeCategory === 'Todos' || p.expand?.store?.category === activeCategory;

    // Pro Filters
    const pPrice = p.price || 0;
    const matchesMinPrice = minPrice === '' || pPrice >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || pPrice <= Number(maxPrice);
    const matchCondition = filterCond === 'all' || p.condition === filterCond;
    const matchLocation = filterLoc === 'all' || p.expand?.store?.location === filterLoc;

    return isApproved && matchesSearch && matchesStore && matchesCategory && matchesMinPrice && matchesMaxPrice && matchCondition && matchLocation;
  }), [products, searchTerm, activeStore, activeCategory, minPrice, maxPrice, filterCond, filterLoc]);

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
      alert('¡Solicitud enviada con éxito! El equipo de CapiMercado se contactará contigo pronto.');
      setShowApplyModal(false);
    } catch (err) {
      console.error("Detalle del error:", err.response);
      alert('Hubo un error enviando tu solicitud. Revisa la consola para ver el detalle.');
    }
  };

  const comprarPorWhatsApp = (producto) => {
    const rawPhone = producto.expand?.store?.whatsapp || "";
    const telefono = formatWhatsAppNumber(rawPhone);
    const condicion = producto.condition === 'new' ? 'Nuevo ✨' : (producto.condition === 'open_box' ? 'Open Box 📂' : 'Usado 📦');
    const nombreTienda = producto.expand?.store?.name || "Tienda";
    const mensaje = `Hola ${nombreTienda}, me interesa el ${producto.name} que vi en CapiMercado por ${producto.price} USDT. ¿Sigue disponible?`;
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
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
                  onClick={() => { setActiveStore(null); setSearchType('products'); setActiveCategory('Todos'); window.location.hash = '#/'; }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-all"
                >
                  <ArrowLeft size={16} />
                </motion.button>
              )}
              <div
                className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 group ${!exclusiveStoreId ? 'cursor-pointer' : ''}`}
                onClick={() => { setActiveStore(null); setSearchType('products'); setSearchTerm(''); setActiveCategory('Todos'); window.location.hash = '#/'; }}
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
                    onClick={() => { setSearchType('stores'); setActiveStore(null); }}
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
              {pb.authStore.isValid ? (
                <button onClick={() => window.location.hash = '#/mi-cuenta'} className="flex items-center gap-2 text-sm font-bold text-white hover:text-luxury-green transition-colors bg-white/10 px-4 py-2 rounded-lg border border-white/10 shadow-sm">
                  <User size={16} /> Mi Cuenta
                </button>
              ) : (
                <button onClick={() => window.location.hash = '#/auth'} className="text-sm font-bold bg-white text-[#050505] px-6 py-2 rounded-full hover:bg-slate-200 transition-colors shadow-md">
                  Ingresar
                </button>
              )}
            </div>

            {/* Mobile — right side: Ingresar + Hamburguesa */}
            <div className="md:hidden flex items-center gap-2">
              {!pb.authStore.isValid ? (
                <button onClick={() => { window.location.hash = '#/auth'; setIsMenuOpen(false); }} className="text-xs font-bold bg-white text-[#050505] px-4 py-1.5 rounded-full">
                  Ingresar
                </button>
              ) : (
                <button onClick={() => { window.location.hash = '#/mi-cuenta'; setIsMenuOpen(false); }} className="text-xs font-bold text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
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

      {/* --- MODAL SOLICITUD TIENDA --- */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={20} /></button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Conviértete en Aliado</h3>
            <p className="text-slate-500 text-sm mb-6">Únete al marketplace líder. Completa tus datos y te contactaremos para verificar tu tienda.</p>

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
              <button onClick={() => window.location.hash = '#/panel'} className="text-xs font-bold text-slate-900 hover:underline">Ingresar al Panel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DETALLE DE PRODUCTO (Cierre de Ventas) --- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative shadow-2xl border border-slate-100 dark:border-white/10">

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-white/10 rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="producto-detalle grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mt-4 md:mt-0">

              {/* Lado Izquierdo: Galería de Fotos */}
              <div className="galeria-fotos flex flex-col gap-4">
                <div className="foto-grande aspect-square rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111] relative group">
                  <img
                    src={getImageUrl(selectedProduct, selectedProduct.images?.[imagenSeleccionada], '800x800')}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    onClick={() => window.open(getImageUrl(selectedProduct, selectedProduct.images?.[imagenSeleccionada]), '_blank')}
                  />
                </div>
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {selectedProduct.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(selectedProduct, img, '100x100')}
                        className={`w-20 h-20 shrink-0 object-cover rounded-xl cursor-pointer border-2 transition-all ${imagenSeleccionada === idx ? 'border-slate-900 opacity-100 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95'}`}
                        onClick={() => setImagenSeleccionada(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Lado Derecho: Info y Botones */}
              <div className="info-producto flex flex-col justify-center">
                <p className="text-sm font-bold uppercase tracking-widest mb-1 items-center gap-1 flex" style={{ color: selectedProduct.expand?.store?.primaryColor || '#3b82f6' }}>
                  {selectedProduct.expand?.store?.name || 'CapiMercado'}
                </p>
                <h2 className="text-3xl md:text-4xl font-black mb-2 text-slate-900 dark:text-white tracking-tight leading-tight">{selectedProduct.name}</h2>
                <div className="mb-6 flex items-baseline gap-2">
                  <PriceDisplay amount={selectedProduct.price} className="scale-125 origin-left" />
                  <span className="text-lg text-slate-500 font-bold ml-4">USDT</span>
                </div>

                {/* Condición y Descripción */}
                <div className="mb-8 p-5 bg-slate-50 dark:bg-[#111] rounded-2xl border border-slate-100 dark:border-white/5">
                  <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-1">Condición</p>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4 pb-4 border-b border-slate-200 dark:border-white/10">
                    {selectedProduct.condition === 'new'
                      ? '✨ Nuevo Sellado'
                      : (selectedProduct.condition === 'open_box' ? '📂 Abierto (Open Box)' : `📦 Usado`)
                    }
                  </p>

                  <p className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-2">Descripción</p>
                  <div className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {selectedProduct.description || "Sin descripción adicional proporcionada por el vendedor."}
                  </div>
                </div>

                <div className="flex mt-auto fixed bottom-0 left-0 w-full p-4 sm:p-6 bg-white/90 dark:bg-black/90 backdrop-blur-xl md:static md:bg-transparent z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] md:shadow-none border-t border-slate-100/50 dark:border-white/10 md:border-none rounded-t-3xl md:rounded-none flex-row items-center justify-between md:flex-col md:items-stretch gap-4 md:gap-3">
                  <div className="md:hidden flex flex-col justify-center">
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">Precio Final</span>
                    <PriceDisplay amount={selectedProduct.price} />
                  </div>
                  <button
                    onClick={() => comprarPorWhatsApp(selectedProduct)}
                    disabled={selectedProduct.stock === 'out_of_stock'}
                    className="flex-1 md:w-full bg-[#050505] hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed text-[#FDFBF7] font-bold py-3.5 px-6 md:py-5 md:px-8 rounded-full shadow-premium flex items-center justify-center gap-2 transition-all duration-300 md:hover:-translate-y-1 active:scale-95 text-sm md:text-lg"
                  >
                    <MessageCircle size={20} className="text-luxury-green" /> {selectedProduct.stock === 'out_of_stock' ? 'Agotado' : 'Comprar vía WhatsApp'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <motion.main initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 22 }} className="flex-grow" style={{ willChange: "transform" }}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
             <div className="w-16 h-16 border-4 border-slate-200 border-t-luxury-green rounded-full animate-spin mb-4 mx-auto"></div>
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

                <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wider uppercase mt-2 flex items-center gap-2 w-max">
                  {activeStore.category} {activeStore.location && <><MapPin size={12} /> {activeStore.location}</>}
                </span>

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

        {/* --- FILTER CHIPS: Swipe nativo horizontal (Pilar 4) --- */}
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-8 sm:mb-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 sm:gap-3 pb-2">
            {availableCategories?.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide transition-all ${activeCategory === cat
                  ? 'bg-[#050505] text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-900'
                  }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </section>

        {/* --- DYNAMIC GRID --- */}
        <section id="catalogo" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[40vh] scroll-mt-20 pb-32 sm:pb-20">

          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {searchType === 'stores' && !activeStore ? 'Directorio de Tiendas' : 'Catálogo de Productos'}
            </h2>
            {searchType === 'products' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-medium transition-colors px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg ${showFilters ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Filtros
              </button>
            )}
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStores?.map(s => (
                <div
                  key={s.id}
                  onClick={() => { window.location.hash = `#/store/${s.slug || s.id}`; }}
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
                    <h5 className="font-bold text-lg text-slate-900 tracking-tight leading-none mb-1">{s.name}</h5>
                    <p className="text-xs font-medium text-slate-500">{s.category} {s.location && `• ${s.location}`}</p>
                  </div>
                  <ChevronRight className="ml-auto text-slate-300 group-hover:text-slate-900 transition-colors group-hover:translate-x-1 z-10" />
                </div>
              ))}
            </div>
          )}

          {/* RENDERING PRODUCTS */}
          {searchType === 'products' && (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8 mt-4">
                  {filteredProducts?.map((p) => {
                    const storeBrandColor = p.expand?.store?.primaryColor || '#0f172a';
                    const mainImage = p.images?.length > 0 ? p.images[0] : null;
                    const displayCondition = p.condition === 'new' ? '✨ Nuevo' : (p.condition === 'open_box' ? '📂 Open Box' : '📦 Usado');
                    const isOutOfStock = p.stock === 'out_of_stock';

                    return (
                      <ProductCard
                        key={p.id}
                        product={p}
                        activeStoreName={activeStore ? activeStore.name : null}
                        storeBrandColor={storeBrandColor}
                        mainImage={mainImage}
                        getImageUrl={getImageUrl}
                        displayCondition={displayCondition}
                        isOutOfStock={isOutOfStock}
                        onSelectProduct={(prod) => {
                          setSelectedProduct(prod);
                          setImagenSeleccionada(0);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-slate-500 font-medium max-w-sm">No encontramos artículos que coincidan con tu búsqueda y filtros actuales.</p>
                </div>
              )}
            </>
          )}
        </section>
      </>)}</motion.main>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <span className="text-lg font-bold text-slate-900">CapiMercado</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                El ecosistema de tecnología de alta gama líder en Venezuela. Calidad certificada y entregas seguras.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Compañía</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Sobre Nosotros</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Sedes</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">ADJML LLC</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Garantía Premium</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Métodos de Envío</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Preguntas Frecuentes</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">Recibe ofertas exclusivas de tecnología.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="tu@email.com" className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-slate-900 transition-shadow" />
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">Unirme</button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs uppercase tracking-widest font-semibold">
            <p>© 2026 CapiMercado. Proyecto por ADJML LLC.</p>
            <div className="flex gap-6">
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Instagram</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Twitter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// 2. VISTA VENDEDOR (BACKSTAGE OSCURO) - Flujo Seguro con Email y Password
// ============================================================================
function SellerPortalView() {
  const [myStores, setMyStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeIdInput, setStoreIdInput] = useState('');
  const [inventory, setInventory] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [view, setView] = useState('inventory');
  const [isUpdatingBrand, setIsUpdatingBrand] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  // Imágenes
  const [newProductImages, setNewProductImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    return () => {
      newProductImages.forEach(img => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
      if (previewBanner) URL.revokeObjectURL(previewBanner);
      if (previewLogo) URL.revokeObjectURL(previewLogo);
    };
  }, [newProductImages, previewBanner, previewLogo]);

  const handleAddImages = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setNewProductImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index) => {
    setNewProductImages(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setNewProductImages([]);
    setImagesToDelete([]);
  }, [editingProduct, view]);

  // Intentar cargar la tienda si el usuario está autenticado
  useEffect(() => {
    if (!pb.authStore.isValid) {
      window.location.hash = '#/auth';
      return;
    }
    pb.collection('stores').getFullList({ filter: `owner = "${pb.authStore.model.id}"` })
      .then(stores => {
        setMyStores(stores);
        if (stores.length === 1) {
          setSelectedStore(stores[0]);
          loadInventory(stores[0].id);
        }
        setIsLoadingStore(false);
      })
      .catch((err) => { console.error('Error exacto de PB (SellerPortal):', err.response?.data); console.error(err); setMyStores([]); setIsLoadingStore(false); });
  }, []);

  if (!pb.authStore.isValid) return null;

  const handleClaimStore = async (e) => {
    e.preventDefault();
    if (!storeIdInput) return;
    try {
      const updatedStore = await pb.collection('stores').update(storeIdInput, {
        owner: pb.authStore.model.id
      });
      setMyStores([...myStores, updatedStore]);
      setSelectedStore(updatedStore);
      loadInventory(updatedStore.id);
      alert("¡Tienda vinculada con éxito! Ya puedes agregar productos.");
    } catch (error) {
      console.error(error);
      alert("Store ID inválido, o la tienda ya tiene dueño o ha sido inhabilitada. Contacta a soporte.");
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.hash = '#/';
  };

  const loadInventory = async (id) => {
    const records = await pb.collection('products').getFullList({
      filter: `store = "${id}"`
    });
    setInventory(records);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formElement = e.target;
    const fd = new FormData(formElement);
    fd.append('store', selectedStore.id);
    fd.delete('images');
    newProductImages.forEach(img => fd.append('images', img.file));

    try {
      await pb.collection('products').create(fd);
      formElement.reset();
      setNewProductImages([]);
      loadInventory(selectedStore.id);
      setView('inventory');
      alert("Producto publicado en CapiMercado.");
    } catch (err) {
      console.error(err);
      alert("Error al subir el producto. Verifica la conexión o el formato de las imágenes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditarProducto = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const formElement = e.target;
    const fd = new FormData(formElement);

    fd.delete('images');
    // Agregar nuevas imagenes
    if (newProductImages.length > 0) {
      newProductImages.forEach(img => fd.append('images', img.file));
    }
    // Eliminar imagenes marcadas con X
    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach(filename => fd.append('images-', filename));
    }

    try {
      await pb.collection('products').update(editingProduct.id, fd);
      alert("¡Publicacion actualizada con exito!");
      setEditingProduct(null);
      setNewProductImages([]);
      setImagesToDelete([]);
      loadInventory(selectedStore.id);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar. Verifica la conexión o el formato de las imágenes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar producto definitivamente?')) {
      await pb.collection('products').delete(id);
      loadInventory(selectedStore.id);
    }
  };

  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    setIsUpdatingBrand(true);
    const formElement = e.target;
    const fd = new FormData(formElement);

    try {
      const updatedStore = await pb.collection('stores').update(selectedStore.id, fd);
      setSelectedStore(updatedStore);
      setMyStores(myStores?.map(s => s.id === updatedStore.id ? updatedStore : s));
      setPreviewBanner(null);
      setPreviewLogo(null);
      alert("¡Tienda actualizada profesionalmente!");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la marca. Verifica el tamaño de las imágenes.");
    } finally {
      setIsUpdatingBrand(false);
    }
  };

  // PANTALLA DE RECLAMAR TIENDA
  if (isLoadingStore) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-pulse">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-12 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-200/50 rounded-[20px]"></div>
              <div>
                <div className="w-48 h-8 bg-slate-200/50 rounded-lg mb-3"></div>
                <div className="w-24 h-3 bg-slate-200/50 rounded-full"></div>
              </div>
            </div>
            <div className="hidden md:block w-32 h-10 bg-slate-200/50 rounded-full"></div>
          </div>
          <div className="flex gap-4 mb-8">
            <div className="w-32 h-10 bg-slate-200/50 rounded-full"></div>
            <div className="w-32 h-10 bg-slate-200/50 rounded-full"></div>
          </div>
          <div className="h-[200px] bg-slate-200/50 rounded-3xl mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-200/50 rounded-3xl"></div>
            <div className="h-32 bg-slate-200/50 rounded-3xl"></div>
            <div className="h-32 bg-slate-200/50 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (myStores.length > 1 && !selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans selection:bg-luxury-green/20">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-2">Selector de Empresas</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Elige la tienda que deseas administrar</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myStores?.map(store => (
              <div
                key={store.id}
                onClick={() => { setSelectedStore(store); loadInventory(store.id); }}
                className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-premium transition-all cursor-pointer flex flex-col gap-4 hover:-translate-y-1"
              >
                {store.logo ? (
                  <SafeImage src={getImageUrl(store, store.logo, '100x100')} alt={store.name} className="w-16 h-16 rounded-2xl bg-slate-50 shadow-sm" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black bg-slate-50 text-slate-400">{store.name.charAt(0)}</div>
                )}
                <div>
                  <h4 className="font-extrabold text-xl tracking-tight text-slate-900">{store.name}</h4>
                  <p className="text-xs font-bold text-slate-400">{store.category || 'Sin Categoría'}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => window.location.hash = '#/'} className="mt-12 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} /> Volver al Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6 selection:bg-luxury-green/20">
        <div className="w-full max-w-md">
          <button onClick={() => window.location.hash = '#/'} className="mb-12 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors">
            <ArrowLeft size={14} /> Volver al Marketplace
          </button>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-premium">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <Key className="text-luxury-green" size={24} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Validación <br />de Tienda</h2>
            <p className="text-xs font-bold text-slate-500 mb-10">Ingresa el ID secreto proporcionado al aprobar tu solicitud.</p>

            <form onSubmit={handleClaimStore} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="ID Secreto de Tienda"
                  className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm font-medium outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-colors placeholder:text-slate-400 shadow-sm"
                  value={storeIdInput}
                  onChange={(e) => setStoreIdInput(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-premium hover:-translate-y-0.5 mt-4">
                Vincular Tienda y Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD VENDEDOR
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12 font-sans relative">

      {/* MODAL DE EDICIÓN DE PRODUCTO */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 md:p-10 w-full max-w-2xl border border-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setEditingProduct(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 text-luxury-green rounded-2xl flex items-center justify-center shadow-sm"><Edit2 size={24} /></div>
              <h3 className="font-extrabold text-2xl tracking-tight">Editar Publicación</h3>
            </div>

            <form onSubmit={handleEditarProducto} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Nombre del Producto</label>
                  <input name="name" type="text" defaultValue={editingProduct.name} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Precio (USDT)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct.price} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Categoría</label>
                  <select name="category" defaultValue={editingProduct.category} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="" disabled>Selecciona...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Marca (Opcional)</label>
                  <input name="brand" type="text" defaultValue={editingProduct.brand} placeholder="Ej: Apple, Samsung..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Condición</label>
                  <select name="condition" defaultValue={editingProduct.condition || 'new'} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="new">✨ Nuevo</option>
                    <option value="open_box">📂 Open Box</option>
                    <option value="used">📦 Usado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Stock</label>
                  <select name="stock" defaultValue={editingProduct.stock || 'available'} required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="available">✅ Disponible</option>
                    <option value="out_of_stock">❌ Agotado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Detalles de uso (Opcional)</label>
                <input name="usage_details" type="text" defaultValue={editingProduct.usage_details} placeholder="Ej: Condición 9/10..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción Detallada</label>
                <textarea name="description" rows="3" defaultValue={editingProduct.description} placeholder="Incluye: caja original, cable USB-C, garantia del vendedor..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
              </div>

              <div>
                {/* Galeria EXISTENTE en PocketBase - con X para eliminar */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="mb-5">
                    <label className="text-xs font-bold text-slate-500 mb-3 block">
                      Fotos actuales ({editingProduct.images.length - imagesToDelete.length} activas — haz clic en X para eliminar)
                    </label>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2.5">
                      {editingProduct.images.map((filename) => {
                        const isMarked = imagesToDelete.includes(filename);
                        return (
                          <div key={filename} className={`relative aspect-square rounded-xl overflow-hidden border-2 group transition-all ${isMarked ? 'opacity-30 grayscale border-red-300' : 'border-slate-100 hover:border-slate-300'}`}>
                            <img src={getImageUrl(editingProduct, filename, '200x200')} alt="foto" className="w-full h-full object-cover" />
                            {isMarked ? (
                              <button type="button" onClick={() => setImagesToDelete(prev => prev.filter(f => f !== filename))}
                                className="absolute inset-0 bg-red-400/20 flex items-center justify-center text-red-600 font-extrabold text-[9px] uppercase tracking-widest">
                                Deshacer
                              </button>
                            ) : (
                              <button type="button" onClick={() => setImagesToDelete(prev => [...prev, filename])}
                                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600">
                                <X size={11} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {imagesToDelete.length > 0 && (
                      <p className="text-xs text-red-500 font-bold mt-2">{imagesToDelete.length} foto(s) se eliminaran al guardar</p>
                    )}
                  </div>
                )}

                {/* Nuevas Imagenes - Preview antes de subir */}
                <label className="text-xs font-bold text-slate-500 mb-3 block">Agregar nuevas fotos</label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {newProductImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-indigo-100 group">
                      <img src={img.preview} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shadow-md">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-luxury-green transition-all cursor-pointer bg-white">
                    <Plus size={22} className="mb-1.5" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-center px-2">{newProductImages.length > 0 ? 'Anadir Mas' : 'Subir Fotos'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-white text-slate-500 border border-slate-200 py-4 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm text-center">
                  Cancelar
                </button>
                <button type="submit" disabled={isUploading} className="flex-1 bg-slate-900 text-white py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-premium hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-center">
                  {isUploading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-100/50">
          <div className="flex items-center gap-6">
            {selectedStore.logo && (
              <SafeImage
                src={getImageUrl(selectedStore, selectedStore.logo, '100x100')}
                alt="Logo"
                className="w-16 h-16 rounded-[20px] shadow-sm bg-white"
              />
            )}
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
                {selectedStore.name}
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-luxury-green animate-pulse"></span> Sistema en línea
              </p>
            </div>
          </div>
          <div className="flex gap-4 self-start md:self-auto">
            {myStores.length > 1 && (
              <button onClick={() => setSelectedStore(null)} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <LayoutGrid size={14} /> Cambiar Tienda
              </button>
            )}
            <button onClick={() => window.location.hash = '#/'} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <ArrowLeft size={14} /> Volver al Inicio
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </header>

        {/* --- PESTAÑAS DE NAVEGACIÓN --- */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 border-b border-slate-100 pb-4 px-1">
          <button
            onClick={() => setView('inventory')}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'inventory' ? 'bg-slate-900 text-white shadow-premium' : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Package size={18} /> Mi Inventario
          </button>
          <button
            onClick={() => setView('create')}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'create' ? 'bg-slate-900 text-white shadow-premium' : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Plus size={18} /> Nuevo Artículo
          </button>
          <button
            onClick={() => setView('brand')}
            className={`whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${view === 'brand' ? 'bg-slate-900 text-white shadow-premium' : 'bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'}`}
          >
            <Settings size={18} /> Configuración
          </button>
        </div>

        {view === 'create' && (
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 max-w-4xl mx-auto md:p-12 animate-in fade-in duration-300 shadow-premium">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 text-luxury-green rounded-2xl flex items-center justify-center shadow-sm"><Plus size={24} /></div>
              <h3 className="font-extrabold text-2xl tracking-tight text-slate-900">Nuevo Artículo</h3>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Nombre del Producto</label>
                  <input name="name" type="text" placeholder="Ej: iPhone 16 Pro Max 256GB" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Precio (USDT)</label>
                  <input name="price" type="number" step="0.01" placeholder="999.99" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Categoría</label>
                  <select name="category" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="" disabled selected>Selecciona...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Marca (Opcional)</label>
                  <input name="brand" type="text" placeholder="Ej: Apple, Samsung, Sony..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Condición</label>
                  <select name="condition" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="new">✨ Nuevo</option>
                    <option value="open_box">📂 Open Box</option>
                    <option value="used">📦 Usado</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Stock</label>
                  <select name="stock" required className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 cursor-pointer appearance-none shadow-sm">
                    <option value="available">✅ Disponible</option>
                    <option value="out_of_stock">❌ Agotado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Detalles de uso (Opcional)</label>
                <input name="usage_details" type="text" placeholder="Ej: Bateria al 95%, sin rayones" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción Detallada</label>
                <textarea name="description" rows="3" placeholder="Especificaciones, lo que incluye en la caja..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">Imágenes del Producto</label>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {newProductImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                      <img src={img.preview} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-white/60 rounded-full flex items-center justify-center text-slate-900 hover:text-red-500 hover:bg-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 shadow-xl">
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-luxury-green transition-all cursor-pointer bg-white">
                    <Plus size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">{newProductImages.length > 0 ? 'Añadir Más' : 'Subir Fotos'}</span>
                    <input type="file" multiple accept="image/*" onChange={handleAddImages} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end">
                <button type="button" onClick={() => setView('inventory')} className="px-8 py-4 bg-white text-slate-500 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer text-center">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-premium hover:-translate-y-0.5 text-center"
                >
                  {isUploading ? 'Subiendo archivo...' : 'Publicar en CapiMercado'}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === 'inventory' && (
          <div className="animate-in fade-in duration-300 w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-extrabold text-2xl tracking-tighter text-slate-900 flex items-center gap-3">
                <Package className="text-slate-400" /> Inventario Activo <span className="text-xs font-bold text-luxury-green bg-luxury-green/10 px-3 py-1 rounded-full">{inventory.length}</span>
              </h3>
            </div>

            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inventory?.map(p => {
                  const mainImage = p.images && p.images.length > 0 ? p.images[0] : null;
                  return (
                    <div key={p.id} className={`bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 group transition-all shadow-sm hover:shadow-premium hover:-translate-y-1 ${p.stock === 'out_of_stock' ? 'opacity-60 grayscale' : ''}`}>
                      <div className="relative shrink-0">
                        <SafeImage
                          src={getImageUrl(p, mainImage, '100x100')}
                          alt={p.name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-50 object-cover"
                        />
                        {p.images && p.images.length > 1 && (
                          <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg">+{p.images.length - 1}</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base md:text-lg leading-tight truncate text-slate-900">{p.name}</h4>
                        <p className="text-slate-900 font-extrabold tracking-tight mt-1">{p.price} <span className="text-[10px] font-medium text-slate-500">USDT</span></p>
                        <div className="flex items-center gap-2 mt-2 max-w-full overflow-hidden">
                          {p.condition && <span className="text-[9px] uppercase tracking-widest bg-slate-100 px-2 py-1 flex-shrink-0 rounded-md text-slate-600 font-semibold">p.condition === 'new' ? '✨ Nuevo' : (p.condition === 'open_box' ? '📂 Open Box' : '📦 Usado')</span>}
                          {p.stock === 'out_of_stock' && <span className="text-[9px] uppercase tracking-widest bg-red-50 text-red-500 px-2 py-1 rounded-md font-bold flex-shrink-0">❌ Agotado</span>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => setEditingProduct(p)} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-[40px] bg-white text-slate-400">
                <Package size={48} className="mb-4 opacity-50 text-slate-300" />
                <p className="font-bold text-sm mb-6 max-w-sm text-slate-500">Aún no tienes artículos en tu inventario. ¡Publica el primero para ver tus métricas!</p>
                <button onClick={() => setView('create')} className="px-8 py-3 bg-slate-900 text-white font-bold text-sm rounded-full hover:bg-slate-800 transition-colors shadow-premium flex items-center gap-2 hover:-translate-y-0.5">
                  <Plus size={16} /> Publicar Producto
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'brand' && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 max-w-4xl mx-auto animate-in fade-in duration-300 shadow-premium">
            <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-50 text-luxury-green rounded-2xl flex items-center justify-center shadow-sm"><Palette size={24} /></div>
              Personaliza tu Identidad Visual
            </h3>

            <form onSubmit={handleUpdateBrand} className="space-y-8">
              {/* Sección Banner e Info Básica */}
              <div>
                <label className="text-xs font-bold text-slate-500 mb-3 block">Banner Principal de la Tienda (Proporción 16:9)</label>
                {(previewBanner || selectedStore.banner) && (
                  <div className="mb-4 rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[3/1] relative border border-slate-100 bg-slate-50 shadow-sm">
                    {previewBanner ? (
                      <img src={previewBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <SafeImage src={getImageUrl(selectedStore, selectedStore.banner, '1200x400')} alt="Banner" className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className="relative">
                  <input name="banner" type="file" accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPreviewBanner(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-4 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Logo Oficial</label>
                  <div className="flex items-center gap-4">
                    {(previewLogo || selectedStore.logo) && (
                      previewLogo ? (
                        <img src={previewLogo} alt="Logo Preview" className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 object-cover shadow-sm" />
                      ) : (
                        <SafeImage src={getImageUrl(selectedStore, selectedStore.logo, '100x100')} alt="Logo" className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 object-cover shadow-sm" />
                      )
                    )}
                    <input name="logo" type="file" accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                      className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full p-2 pr-6 focus-within:border-luxury-green focus-within:ring-4 focus-within:ring-luxury-green/10 transition-all shadow-sm">
                  <input
                    name="primaryColor"
                    type="color"
                    defaultValue={selectedStore.primaryColor || "#0f172a"}
                    className="w-12 h-12 rounded-full border-0 cursor-pointer bg-transparent overflow-hidden"
                  />
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-500 block">Color de Marca</label>
                    <span className="text-sm font-mono text-slate-400">HEX Code</span>
                  </div>
                </div>
              </div>

              {/* Ubicación y Descripción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Sede o Ubicación (Para filtros)</label>
                  <input name="location" type="text" defaultValue={selectedStore.location} placeholder="Ej: Valencia, Sambil" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 mb-2 block">Descripción de la Marca (Bio)</label>
                  <textarea name="description" defaultValue={selectedStore.description} rows="3" placeholder="Somos distribuidores oficiales..." className="w-full bg-white border border-slate-200 rounded-[24px] px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 resize-none shadow-sm"></textarea>
                </div>
              </div>

              {/* Redes y Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><MessageCircle size={16} className="text-luxury-green" /> WhatsApp Manager</label>
                  <input name="whatsapp" type="text" defaultValue={selectedStore.whatsapp} placeholder="Ej: 58414..." className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                  <p className="text-xs text-slate-400 mt-2 ml-4">Aquí es a donde llegarán tus ventas.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><IconInstagram size={16} className="text-pink-500" /> Instagram</label>
                  <input name="instagram" type="text" defaultValue={selectedStore.instagram} placeholder="@tutienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><Smartphone size={16} className="text-slate-800" /> TikTok</label>
                  <input name="tiktok" type="text" defaultValue={selectedStore.tiktok} placeholder="@tutienda" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2"><IconFacebook size={16} className="text-blue-500" /> Facebook</label>
                  <input name="facebook" type="text" defaultValue={selectedStore.facebook} placeholder="URL o Usuario" className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-luxury-green focus:ring-4 focus:ring-luxury-green/10 transition-all text-slate-900 shadow-sm" />
                </div>
              </div>

              <button type="submit" disabled={isUpdatingBrand} className="w-full bg-slate-900 text-white py-5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all mt-8 shadow-premium disabled:opacity-50 hover:-translate-y-0.5">
                {isUpdatingBrand ? 'Guardando Cambios...' : 'Guardar y Actualizar Marca'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. VISTA MAESTRO SECRETA (ADMIN) - Acceso: #/admin-control-valencia-2026
// ============================================================================
function SuperAdminView() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    pb.collection('stores').getFullList().then(setStores);
  }, []);

  const handleApproveStore = async (id) => {
    if (window.confirm('¿Aprobar esta tienda y generar ID Secreto?')) {
      try {
        await pb.collection('stores').update(id, { status: 'approved' });
        pb.collection('stores').getFullList().then(setStores);
        alert('Tienda aprobada. El ID Secreto ya está activo y la tienda es visible en el marketplace.');
      } catch (error) {
        console.error(error);
        alert('Error al aprobar la tienda.');
      }
    }
  };

  const handleToggleStoreStatus = async (store) => {
    const newStatus = store.status === 'approved' ? 'suspended' : 'approved';
    const actionName = newStatus === 'approved' ? 'Reactivar' : 'Suspender';
    if (window.confirm(`¿Seguro que deseas ${actionName} esta tienda?`)) {
      try {
        await pb.collection('stores').update(store.id, { status: newStatus });
        pb.collection('stores').getFullList().then(setStores);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRejectStore = async (id) => {
    if (window.confirm('¿Rechazar y eliminar esta solicitud permanentemente?')) {
      try {
        await pb.collection('stores').delete(id);
        pb.collection('stores').getFullList().then(setStores);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const pendingStores = stores.filter(s => s.status === 'pending');
  const activeStores = stores.filter(s => s.status !== 'pending');

  return (
    <div className="min-h-screen bg-[#050505] text-[#FDFBF7] p-6 md:p-12 font-sans selection:bg-indigo-500">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-8 border-b border-white/10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30">
              <ShieldAlert className="text-red-500" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-1">NÚCLEO MAESTRO</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500">Acceso Privado ADJML</p>
            </div>
          </div>
          <button onClick={() => window.location.hash = '#/'} className="self-start md:self-auto flex items-center gap-2 px-6 py-3 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            <ArrowLeft size={14} /> Volver al Home
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-12">
          {/* Panel Lateral: Solicitudes y Stats */}
          <div className="space-y-8">
            <div className="bg-[#111] rounded-[40px] p-8 border border-white/5 shadow-2xl">
              <h3 className="font-extrabold text-xl tracking-tighter uppercase mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3"><Store className="text-slate-400" /> Solicitudes Pendientes</div>
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">{pendingStores.length}</span>
              </h3>

              {pendingStores.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-3xl">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Sin solicitudes nuevas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingStores.map(s => (
                    <div key={s.id} className="bg-black border border-white/10 p-5 rounded-3xl group transition-all hover:border-slate-500/50">
                      <h4 className="font-bold text-white mb-1 uppercase tracking-tight">{s.name}</h4>
                      <p className="text-[10px] text-white/50 mb-5 font-mono uppercase tracking-widest">WA: {s.whatsapp}</p>

                      <div className="flex gap-2">
                        <button onClick={() => handleApproveStore(s.id)} className="flex-1 bg-green-500 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-colors">
                          Aprobar Tienda
                        </button>
                        <button onClick={() => handleRejectStore(s.id)} className="px-5 bg-white/5 text-white/50 py-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111] p-6 rounded-[32px] border border-white/5">
                <Activity className="text-slate-400 mb-4" />
                <p className="text-3xl font-black tracking-tighter">{activeStores.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Tiendas Activas</p>
              </div>
              <div className="bg-[#111] p-6 rounded-[32px] border border-white/5">
                <TrendingUp className="text-green-500 mb-4" />
                <p className="text-3xl font-black tracking-tighter">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Uptime</p>
              </div>
            </div>
          </div>

          {/* Lista de Tiendas Aprobadas y Llaves */}
          <div>
            <h3 className="font-extrabold text-2xl tracking-tighter uppercase mb-8 flex items-center gap-3">
              Directorio de Llaves <span className="text-[12px] font-bold opacity-30 tracking-widest bg-white/10 px-3 py-1 rounded-full">{activeStores.length}</span>
            </h3>

            <div className="space-y-4">
              {activeStores.map(s => (
                <div key={s.id} className={`bg-[#111] p-6 rounded-[32px] border ${s.status === 'suspended' ? 'border-red-500/30 opacity-70' : 'border-white/5 hover:border-white/10'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors group relative overflow-hidden`}>
                  <div className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: s.primaryColor || '#ffffff' }}></div>

                  <div className="flex items-center gap-4 pl-2">
                    {s.logo ? (
                      <SafeImage src={getImageUrl(s, s.logo, '100x100')} alt={s.name} className="w-12 h-12 rounded-xl bg-black" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black">{s.name.charAt(0)}</div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-lg uppercase tracking-tight">{s.name} {s.status === 'suspended' && <span className="text-[10px] text-red-500 font-bold ml-2 uppercase">(Suspendida)</span>}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{s.category || 'Sin Categoría'} • WA: {s.whatsapp}</p>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400">{s.id}</span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(s.id); alert('Store ID Copiado'); }}
                      className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-slate-300 transition-colors"
                    >
                      Copiar ID
                    </button>
                    <button
                      onClick={() => handleToggleStoreStatus(s)}
                      className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${s.status === 'approved' ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                    >
                      {s.status === 'approved' ? 'Suspender' : 'Reactivar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}