import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, ArrowLeft, Home } from "lucide-react";

export default function NotFoundView(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 md:p-12 border border-slate-100 shadow-premium text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Store size={40} />
        </div>

        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full inline-block mb-3">
          Error 404
        </span>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Página no encontrada
        </h1>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Lo sentimos, la sección o tienda que estás buscando no existe o ha sido movida.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="w-full bg-slate-900 text-white py-4 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Ir al Marketplace
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full bg-slate-100 text-slate-700 py-4 rounded-full text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
}