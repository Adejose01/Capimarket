import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { StoreService } from "@/lib/services/pb/store.service";
import { validateStoreInput } from "@/lib/validators/store.validator";

interface ApplyStoreModalProps {
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSuccess: () => void;
}

// Lista de prefijos comunes
const COUNTRY_CODES = [
  { code: "+58", label: "🇻🇪 +58" },
  { code: "+57", label: "🇨🇴 +57" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+52", label: "🇲🇽 +52" },
  { code: "+54", label: "🇦🇷 +54" },
  { code: "+56", label: "🇨🇱 +56" },
  { code: "+34", label: "🇪🇸 +34" },
];

export const ApplyStoreModal: React.FC<ApplyStoreModalProps> = ({
  userId,
  userEmail,
  onClose,
  onSuccess,
}) => {
  const [countryCode, setCountryCode] = useState("+58");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [instagram, setInstagram] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite únicamente ingresar números en el campo
    const digitsOnly = e.target.value.replace(/\D/g, "");
    setPhoneDigits(digitsOnly);
  };

  const handleInstagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Si el usuario escribe o pega con '@', se lo removemos en vivo
    const cleanValue = e.target.value.replace(/^@/, "");
    setInstagram(cleanValue);
  };

  const handleApplyToSell = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    // 1. Validar y sanitizar con el Helper Centralizado
    const { isValid, errors, sanitizedValues } = validateStoreInput({
      instagram,
      countryCode,
      phoneDigits,
    });

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    // 2. Armar Payload con datos limpios
    const storePayload = {
      ownerId: userId,
      name: String(fd.get("name") || "").trim(),
      instagram: sanitizedValues.instagram, // Guardado sin @ (ej: "tutienda")
      whatsapp: sanitizedValues.whatsapp,   // Guardado completo con prefijo (ej: "+584141234567")
      correo: String(fd.get("correo") || userEmail || "").trim(),
      category: String(fd.get("category") || ""),
      description: String(fd.get("description") || ""),
      location: String(fd.get("location") || ""),
    };

    // 3. Ejecución exclusiva con .then() / .catch()
    StoreService.create(storePayload)
      .then(() => {
        toast.success(
          "¡Solicitud enviada con éxito! El equipo de CapiMercado se contactará contigo pronto."
        );
        onSuccess();
        onClose();
      })
      .catch((err) => {
        console.error("Error al enviar solicitud de tienda:", err);
        toast.error("Hubo un error enviando tu solicitud.");
      });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 cursor-pointer"
        >
          <X size={20} />
        </button>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Conviértete en Aliado
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          Completa tus datos y te contactaremos para verificar tu tienda.
        </p>

        <form onSubmit={handleApplyToSell} className="space-y-4">
          {/* Nombre de la tienda */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">
              Nombre de tu Tienda
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ej: TechStore C.A."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>

          {/* Instagram con prefijo @ decorativo */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">
              Usuario en Instagram
            </label>
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all">
              <span className="inline-flex items-center px-4 text-slate-500 font-bold bg-slate-100 border-r border-slate-200 text-sm select-none">
                @
              </span>
              <input
                type="text"
                required
                maxLength={30}
                value={instagram}
                onChange={handleInstagramChange}
                placeholder="tutienda"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* WhatsApp con Selector de Prefijo y Formato Numérico */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">
              WhatsApp
            </label>
            <div className="flex rounded-xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-100 border-r border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 outline-none cursor-pointer"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                required
                value={phoneDigits}
                onChange={handlePhoneChange}
                maxLength={11}
                placeholder="4141234567"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-1 block">
              Correo
            </label>
            <input
              name="correo"
              type="email"
              required
              defaultValue={userEmail}
              placeholder="tu@correo.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
          >
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  );
};