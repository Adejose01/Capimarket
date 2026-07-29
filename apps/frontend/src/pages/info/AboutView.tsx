import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Terminal,
  ShieldCheck,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function AboutView(): React.JSX.Element {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleGoToAuth = (): void => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar isScrolled={true} variant="minimal" />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Botón Volver */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors mb-12 cursor-pointer"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          {/* Encabezado */}
          <header className="mb-16">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Terminal className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Una plataforma independiente para el comercio local
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              CapiMercado no es una corporación tradicional. Somos una
              iniciativa autofinanciada diseñada con un propósito claro:
              democratizar el acceso a catálogos digitales para cualquier
              vendedor.
            </p>
          </header>

          <div className="space-y-12">
            {/* Sección 1: El Propósito */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Catálogos al alcance de todos
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Creemos que tener un catálogo web rápido, profesional y
                autogestionable no debería ser un privilegio costoso. Cualquier
                persona o tienda que se registre en nuestra web obtiene de
                inmediato las herramientas necesarias para publicar sus
                productos, gestionar su stock y conectar directamente con sus
                clientes.
              </p>
            </section>

            {/* Sección 2: Enfoque Funcional */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Conexión directa, sin intermediarios
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nuestra funcionalidad es simple y directa: actuamos como un
                puente tecnológico. No cobramos comisiones abusivas por venta ni
                retenemos tu dinero. El cliente ve tu catálogo, selecciona lo
                que necesita y la transacción final se acuerda de forma directa
                entre ambas partes. Tú mantienes el control absoluto de tu
                negocio.
              </p>
            </section>

            {/* Sección 3: Filosofía Bootstrap / Indie */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Desarrollo independiente y honesto
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Este ecosistema se construye a pulso, optimizando recursos para
                ofrecer una plataforma increíblemente rápida, ligera y segura.
                Al no depender de grandes fondos de inversión externos, nuestras
                únicas prioridades son la estabilidad del servicio y la
                satisfacción de las tiendas que confían en nosotros para mostrar
                su trabajo.
              </p>
            </section>

            {/* Sección de Conversión / Call to Action integrada */}
            <section className="pt-10 mt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  ¿Listo para digitalizar tu stock?
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Crea tu cuenta gratis en menos de un minuto y empieza a
                  publicar.
                </p>
              </div>
              <button
                onClick={handleGoToAuth}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 cursor-pointer"
              >
                Crear mi Catálogo <ArrowUpRight size={16} />
              </button>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
