import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Mail, Sparkles, Coffee, MessageSquareCode } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function SupportView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Botón Volver */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors mb-12"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          {/* Encabezado */}
          <header className="mb-16">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Heart className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Apoya a CapiMercado
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Somos un proyecto independiente y autofinanciado. Nuestro objetivo es que cualquier persona pueda digitalizar su catálogo tecnológico de forma gratuita y sin barreras.
            </p>
          </header>

          <div className="space-y-16">
            
            {/* SECCIÓN 1: El Futuro del Proyecto e Inspiración al Soporte */}
            <section className="bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-slate-900 rounded-3xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-emerald-500" size={22} />
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Nuestra Visión y Sostenibilidad
                </h2>
              </div>
              
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  Mantener los servidores, optimizar el rendimiento y desarrollar nuevas funcionalidades requiere tiempo y recursos. Actualmente asumimos el costo de forma completamente independiente para asegurar que la plataforma siga siendo rápida y accesible.
                </p>
                <p>
                  Nuestra filosofía de monetización es simple: **el catálogo básico siempre será gratuito**. No creemos en limitar el crecimiento de las tiendas locales con comisiones ocultas. 
                </p>
                <p>
                  En el futuro, planeamos introducir **planes y servicios premium opcionales** (como mayor personalización de marca, integraciones avanzadas y estadísticas detalladas). Si valoras el impacto de esta iniciativa en el comercio local, te invitamos a considerar adquirir estas herramientas de pago cuando estén disponibles. Tu apoyo garantizará que la base del proyecto siga siendo libre para todos.
                </p>
              </div>

              {/* Pequeña tarjeta informativa de la hoja de ruta */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <Coffee className="text-emerald-500" size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">¿Cómo ayudarnos hoy?</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    La mejor forma de apoyarnos ahora mismo es compartiendo la plataforma con tiendas de tecnología o dejándonos tu feedback para seguir puliendo la herramienta.
                  </p>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: Sugerencias, Feedback y Contacto por Correo */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquareCode className="text-emerald-500" size={22} />
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  ¿Tienes sugerencias o ideas?
                </h2>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                CapiMercado crece gracias a la comunidad. Si tienes ideas sobre cómo mejorar la gestión de inventario, el diseño de la tienda o crees que falta alguna funcionalidad clave, queremos escucharte de primera mano.
              </p>

              <div className="bg-slate-50/50 dark:bg-[#111111]/30 border border-slate-100 dark:border-slate-900/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Mail className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                      Contáctanos directamente
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Escríbenos para reportar errores, proponer alianzas o sugerir mejoras.
                    </p>
                  </div>
                </div>

                {/* 
                  ENLACE DE CONTACTO POR CORREO:
                  Cambia '/contact' por la ruta de tu página de contacto por correo cuando la implementes 
                */}
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm transition-all active:scale-98"
                >
                  Ir a Contactar <Mail size={16} />
                </button>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}