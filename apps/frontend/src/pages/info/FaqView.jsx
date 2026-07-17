import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

export default function FaqView() {
  const navigate = useNavigate();
  
  // Estado para controlar qué pregunta está abierta (guarda el índice)
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Qué es CapiMercado?",
      answer: "CapiMercado es una plataforma digital e independiente diseñada para que cualquier persona, emprendedor o tienda de tecnología en Venezuela pueda registrarse y crear su propio catálogo web autogestionable de forma rápida, fluida y completamente gratuita."
    },
    {
      question: "¿Quiénes somos?",
      answer: "Somos una iniciativa independiente, impulsada a pulmón y autofinanciada (bootstrap). No formamos parte de ninguna gran corporación. Creemos firmemente en democratizar el acceso al comercio electrónico local, ofreciendo una alternativa transparente, rápida y sin barreras de entrada para los comercios de tecnología."
    },
    {
      question: "¿Cómo funcionamos?",
      answer: "Funcionamos bajo un modelo de conexión directa. Te registras, creas tu inventario y la plataforma genera tu catálogo público. Cuando un comprador se interesa por un artículo de tu stock, te contacta directamente para acordar el pago y la entrega. Nosotros no retenemos dinero, no intervenimos en tus transacciones ni cobramos comisiones por tus ventas."
    }
  ];

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
              <HelpCircle className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
              Preguntas Frecuentes
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Encuentra respuestas rápidas sobre el funcionamiento de la plataforma y nuestra filosofía de trabajo.
            </p>
          </header>

          {/* Sección de Acordeón */}
          <div className="space-y-4 mb-16">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="border border-slate-100 dark:border-slate-900 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/30 dark:bg-[#111111]/30 hover:border-slate-200 dark:hover:border-slate-800"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:outline-none"
                  >
                    <span className="text-base md:text-lg">{faq.question}</span>
                    <ChevronDown 
                      size={18} 
                      className={`text-slate-400 dark:text-slate-500 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'transform rotate-180 text-emerald-500' : ''
                      }`} 
                    />
                  </button>

                  {/* Contenedor colapsable con animación suave de CSS */}
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-slate-100 dark:border-slate-900' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tarjeta de soporte rápido si no consiguen respuesta */}
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="text-emerald-500 shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">¿Aún tienes dudas?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estamos aquí para ayudarte a configurar tu espacio.</p>
              </div>
            </div>
            {/* 
              ENLACE DE CONTACTO POR CORREO:
              Apunta a tu ruta de contacto cuando esté lista
            */}
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shrink-0"
            >
              Escríbenos
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}