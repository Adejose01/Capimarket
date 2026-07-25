import React from "react";

interface BuyerProfileHeaderProps {
  name?: string;
  email: string;
}

export const BuyerProfileHeader: React.FC<BuyerProfileHeaderProps> = ({
  name,
  email,
}) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex items-center gap-6 mb-8">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
        {initial}
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
          {name || "Usuario CapiMercado"}
        </h1>
        <p className="text-sm font-medium text-slate-500">{email}</p>
        <span className="inline-block mt-3 px-3 py-1 bg-white text-xs font-bold uppercase tracking-wider text-slate-800 rounded-md border border-slate-200">
          Cuenta Comprador
        </span>
      </div>
    </div>
  );
};