import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  // Función reutilizable para subir al inicio de la página suavemente
  const handleNavigation = (to) => {
    if (to) {
      navigate(to);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo y Eslogan */}
          <div className="space-y-4">
            <div 
              onClick={() => handleNavigation('/')} 
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-6 h-6 bg-slate-900 dark:bg-emerald-500 rounded flex items-center justify-center transition-transform group-hover:scale-105">
                <span className="text-white dark:text-black font-bold text-xs">C</span>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">CapiMercado</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Catálogo independiente y accesible para todos en Venezuela.
            </p>
          </div>

          {/* Compañía */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Compañía</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors text-left"
                >
                  Sobre Nosotros
                </button>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Soporte</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => handleNavigation('/support')} // Apóyanos
                  className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors text-left"
                >
                  Apóyanos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/faq')} 
                  className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors text-left"
                >
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Sugerencias y Contacto */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Sugerencias</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                ¿Tienes alguna idea para mejorar el ecosistema o deseas reportar un problema?
              </p>
            </div>
            <button 
              onClick={() => handleNavigation('/contact')}
              className="w-full bg-slate-900 dark:bg-emerald-500 hover:bg-slate-800 dark:hover:bg-emerald-400 text-white dark:text-black py-2.5 rounded-xl text-sm font-bold transition-all active:scale-98 text-center"
            >
              Escríbenos
            </button>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          <p>© 2026 CapiMercado. Proyecto independiente.</p>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => handleNavigation('/privacy')} 
              className="hover:text-slate-900 dark:hover:text-emerald-500 transition-colors"
            >
              Privacidad
            </button>
            <button 
              onClick={() => handleNavigation('/terms')} 
              className="hover:text-slate-900 dark:hover:text-emerald-500 transition-colors"
            >
              Términos
            </button>
            <a 
              href="https://instagram.com/tu_usuario" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}