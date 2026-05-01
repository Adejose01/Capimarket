import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Cookie } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyView() {
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
              <Shield className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Última actualización: 1 de Mayo, 2026
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Recopilación de Datos</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                En CapiMercado, la privacidad de nuestros usuarios es fundamental. Recopilamos información personal solo cuando es estrictamente necesario para brindarte una experiencia exclusiva:
              </p>
              <ul className="list-none space-y-3">
                <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Google OAuth:</strong> Al iniciar sesión con Google, recopilamos únicamente tu nombre y correo electrónico para la creación y gestión de tu perfil personal.</span>
                </li>
                <li className="flex gap-3 text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span><strong>Imágenes de Productos:</strong> Las imágenes cargadas por los vendedores se almacenan en nuestros servidores seguros para su visualización en el marketplace.</span>
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Uso y Protección</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Garantizamos que <strong>no vendemos, alquilamos ni compartimos</strong> tus datos personales con terceras partes con fines comerciales. Tu información se utiliza exclusivamente para la operación técnica de la plataforma y la comunicación de soporte oficial.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="text-emerald-500" size={20} />
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 dark:text-white">Cookies y Sesión</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Utilizamos "cookies" técnicas esenciales y almacenamiento local para mantener tu sesión iniciada de forma segura y recordar tus preferencias de visualización. Estas tecnologías son necesarias para el funcionamiento correcto de tu cuenta y el panel de vendedor.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-400 italic">
                Para cualquier duda sobre el tratamiento de tus datos, puedes contactarnos en: <span className="text-emerald-500 font-bold">soporte@capimercado.com</span>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
