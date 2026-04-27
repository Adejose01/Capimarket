import React from 'react';

export default function Footer() {
  return (
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
  );
}
