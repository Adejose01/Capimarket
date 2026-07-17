import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Sparkles, MessageSquare } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function ContactView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'sugerencia', // valor por defecto
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dirección de correo del proyecto
    const adminEmail = 'soporte.capimercado@gmail.com'; // <-- Cambia esto por tu correo real de soporte
    
    // Construimos un asunto limpio y estructurado
    const subject = encodeURIComponent(`[CapiMercado] ${formData.reason.toUpperCase()} - de ${formData.name}`);
    
    // Cuerpo del correo bien formateado para que te llegue ordenado
    const body = encodeURIComponent(
      `Hola equipo de CapiMercado,\n\n` +
      `Mi nombre es: ${formData.name}\n` +
      `Mi correo de contacto: ${formData.email}\n` +
      `Motivo del mensaje: ${formData.reason.toUpperCase()}\n\n` +
      `Mensaje:\n${formData.message}\n\n` +
      `---\nEnviado desde el formulario de contacto de CapiMercado.`
    );

    // Abrimos el cliente de correo del usuario con los datos listos
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

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
          <header className="mb-12">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Mail className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Ponte en contacto
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              ¿Tienes alguna sugerencia para mejorar la plataforma, encontraste un error o quieres proponernos algo? Escríbenos directamente.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Formulario */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Motivo del Mensaje
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="sugerencia">Enviar una Sugerencia o Idea</option>
                    <option value="error">Reportar un Error (Bug)</option>
                    <option value="ayuda">Soporte con mi Cuenta / Catálogo</option>
                    <option value="otro">Otro Motivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Tu Mensaje
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe detalladamente tu idea o el problema que experimentas..."
                    className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98"
                >
                  Preparar Correo <Send size={16} />
                </button>
              </form>
            </div>

            {/* Sidebar informativo */}
            <div className="space-y-8">
              <div className="bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-slate-900 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-emerald-500" size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">Desarrollo Abierto</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Al ser un proyecto independiente, valoramos enormemente cada reporte de error o sugerencia de usabilidad. Leemos absolutamente todos los correos que nos llegan.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-slate-900 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="text-emerald-500" size={18} />
                  <h3 className="font-bold text-sm uppercase tracking-wider">¿Qué incluir?</h3>
                </div>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed list-disc list-inside">
                  <li>Capturas de pantalla o pasos para reproducir un error.</li>
                  <li>Ideas claras de cómo mejorar tu flujo como vendedor.</li>
                  <li>Detalles de contacto adicionales si los ves necesarios.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}