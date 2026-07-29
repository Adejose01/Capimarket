import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Scale,
  ShoppingBag,
  AlertTriangle,
  XCircle,
  Mail,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function TermsView(): React.JSX.Element {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleGoToContact = (): void => {
    navigate("/contact");
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
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Naturaleza del Servicio
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                CapiMercado es un marketplace que actúa exclusivamente como{" "}
                <strong>conector</strong> entre tiendas (vendedores) y
                compradores. No somos propietarios de los productos publicados
                ni intervenimos en las transacciones finales realizadas fuera de
                nuestra plataforma.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Responsabilidad del Usuario
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                El usuario es el único responsable de la veracidad de la
                información, imágenes y precios de los productos que publique.
                CapiMercado no garantiza la calidad, seguridad o legalidad de
                los artículos promocionados por terceros.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Moderación y Normas
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Nos reservamos el derecho de{" "}
                <strong>eliminar tiendas o productos</strong> que incumplan las
                normas de la comunidad, incluyan contenido ofensivo, fraudulento
                o que no corresponda al rubro de la plataforma. El
                incumplimiento reiterado resultará en el bloqueo permanente del
                acceso.
              </p>
            </section>

            {/* Aviso legal y botón a Contacto */}
            <section className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
              <p className="text-sm text-slate-400 leading-relaxed">
                Al utilizar CapiMercado, aceptas estos términos en su totalidad.
                El uso continuo de la plataforma tras cualquier cambio en estos
                términos constituirá tu aceptación de dichos cambios.
              </p>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-emerald-500 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      ¿Tienes dudas legales o sobre los términos?
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Puedes escribirnos para solicitar aclaraciones sobre el
                      uso del servicio.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleGoToContact}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Contactar Soporte
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
