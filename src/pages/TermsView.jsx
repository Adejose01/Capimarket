import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, ShoppingBag, AlertTriangle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors mb-12"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          <header className="mb-16">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Scale className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Términos y Condiciones
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Última actualización: 1 de Mayo, 2026
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Naturaleza del Servicio</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                CapiMercado es un marketplace de tecnología que actúa exclusivamente como <strong>conector</strong> entre tiendas (vendedores) y compradores. No somos propietarios de los productos publicados ni intervenimos en las transacciones finales realizadas fuera de nuestra plataforma.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Responsabilidad del Usuario</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                El usuario es el único responsable de la veracidad de la información, imágenes y precios de los productos que publique. CapiMercado no garantiza la calidad, seguridad o legalidad de los artículos promocionados por terceros.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Moderación y Normas</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nos reservamos el derecho de <strong>eliminar tiendas o productos</strong> que incumplan las normas de la comunidad, incluyan contenido ofensivo, fraudulento o que no corresponda al rubro de tecnología y lujo de la plataforma. El incumplimiento reiterado resultará en el bloqueo permanente del acceso.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-400">
                Al utilizar CapiMercado, aceptas estos términos en su totalidad. El uso continuo de la plataforma tras cualquier cambio en estos términos constituirá tu aceptación de dichos cambios.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
