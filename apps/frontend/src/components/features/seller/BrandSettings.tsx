import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Palette, MessageCircle, Tag } from "lucide-react";
import { CategoriesService } from "@/lib/services/pb/categories.service";
import type { CategoryRecord, StoreRecord } from "@/lib/types/pocketbase";
import { StoreService } from "@/lib/services/pb/store.service";
import { getImageUrl } from "@/lib/utils";
import { COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/lib/constants/countryCodes";
import SafeImage from "@/components/common/SafeImage";

interface BrandSettingsProps {
  selectedStore: StoreRecord;
  onUpdateSuccess: (updatedStore: StoreRecord) => void;
}

const parsePhone = (rawPhone?: string) => {
  if (!rawPhone) return { code: DEFAULT_COUNTRY_CODE, digits: "" };

  const matchedCountry = COUNTRY_CODES.find((item) =>
    rawPhone.startsWith(item.code)
  );

  if (matchedCountry) {
    return {
      code: matchedCountry.code,
      digits: rawPhone.replace(matchedCountry.code, "").trim(),
    };
  }

  return {
    code: DEFAULT_COUNTRY_CODE,
    digits: rawPhone.replace(/^\+\d{1,3}/, "").trim(),
  };
};

export default function BrandSettings({
  selectedStore,
  onUpdateSuccess,
}: BrandSettingsProps) {
  const [isUpdatingBrand, setIsUpdatingBrand] = useState<boolean>(false);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryRecord[]>([]);

  // 1. ESTADOS CONTROLADOS PARA TODOS LOS CAMPOS DE LA TIENDA
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [primaryColor, setPrimaryColor] = useState<string>("#0f172a");
  const [location, setLocation] = useState<string>("");
  const [mapsUrl, setMapsUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [phoneDigits, setPhoneDigits] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");

  // 🔄 SINCRONIZACIÓN AUTOMÁTICA CADA VEZ QUE CAMBIE `selectedStore`
  useEffect(() => {
    if (!selectedStore) return;

    // A) Extraer IDs de categorías de forma ultra-robusta
    let categoryIds: string[] = [];

    if (Array.isArray(selectedStore.category)) {
      categoryIds = selectedStore.category.map((cat) =>
        typeof cat === "string" ? cat : (cat as CategoryRecord).id
      );
    } else if (typeof selectedStore.category === "string" && selectedStore.category.trim() !== "") {
      categoryIds = [selectedStore.category];
    } else if (selectedStore.expand?.category) {
      const expCat = selectedStore.expand.category;
      if (Array.isArray(expCat)) {
        categoryIds = expCat.map((c) => c.id);
      } else if (expCat && typeof expCat === "object" && "id" in expCat) {
        categoryIds = [(expCat as CategoryRecord).id];
      }
    }

    setSelectedCategories(categoryIds);

    // B) Sincronizar resto de campos
    setPrimaryColor(selectedStore.primaryColor || "#0f172a");
    setLocation(selectedStore.location || "");
    setMapsUrl(selectedStore.maps_url || "");
    setDescription(selectedStore.description || "");

    const parsedPhone = parsePhone(selectedStore.whatsapp);
    setCountryCode(parsedPhone.code);
    setPhoneDigits(parsedPhone.digits);

    setInstagram(
      selectedStore.instagram ? selectedStore.instagram.replace(/^@/, "") : ""
    );

    // Resetear previsualizaciones al cambiar de tienda
    setPreviewBanner(null);
    setPreviewLogo(null);
  }, [selectedStore]);

  // Cargar catálogo global de categorías
  useEffect(() => {
    CategoriesService.getAllCategories()
      .then((cats) => setAllCategories(cats))
      .catch((err: unknown) => {
        console.error("Error al cargar categorías:", err);
        toast.error("No se pudieron cargar las categorías del sistema.");
      });
  }, []);

  // Limpieza de URLs de previsualización
  useEffect(() => {
    return () => {
      if (previewBanner) URL.revokeObjectURL(previewBanner);
      if (previewLogo) URL.revokeObjectURL(previewLogo);
    };
  }, [previewBanner, previewLogo]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const handleUpdateBrand = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      toast.error("Debes seleccionar al menos una categoría para tu tienda.");
      return;
    }

    setIsUpdatingBrand(true);
    const formElement = e.currentTarget;
    const fd = new FormData(formElement);

    // Limpieza de imágenes sin seleccionar
    const bannerFile = fd.get("banner");
    if (bannerFile && bannerFile instanceof File && bannerFile.size === 0) {
      fd.delete("banner");
    }
    const logoFile = fd.get("logo");
    if (logoFile && logoFile instanceof File && logoFile.size === 0) {
      fd.delete("logo");
    }

    // Inserción limpia de categorías
    fd.delete("category");
    selectedCategories.forEach((catId) => fd.append("category", catId));

    // Forzar valores limpios de estados controlados
    fd.set("instagram", instagram);
    fd.set("whatsapp", phoneDigits ? `${countryCode}${phoneDigits}` : "");
    fd.set("primaryColor", primaryColor);
    fd.set("location", location);
    fd.set("maps_url", mapsUrl);
    fd.set("description", description);

    StoreService.update(selectedStore.id, fd)
      .then((updatedStore: StoreRecord) => {
        toast.success("¡Tienda actualizada con éxito!");
        onUpdateSuccess(updatedStore);
      })
      .catch((err: unknown) => {
        console.error("Error al actualizar la tienda:", err);
        toast.error("Hubo un error al actualizar la marca.");
      })
      .finally(() => {
        setIsUpdatingBrand(false);
      });
  };

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 max-w-4xl mx-auto animate-in fade-in duration-300 shadow-premium">
      <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
          <Palette size={24} />
        </div>
        Personaliza tu Identidad Visual
      </h3>

      <form onSubmit={handleUpdateBrand} className="space-y-8">
        {/* Banner Principal */}
        <div>
          <label className="text-xs font-bold text-slate-500 mb-3 block">
            Banner Principal de la Tienda (Proporción 16:9)
          </label>
          {(previewBanner || selectedStore.banner) && (
            <div className="mb-4 rounded-3xl overflow-hidden aspect-21/9 md:aspect-3/1 relative border border-slate-100 bg-slate-50 shadow-sm">
              {previewBanner ? (
                <img
                  src={previewBanner}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <SafeImage
                  src={getImageUrl(
                    selectedStore,
                    selectedStore.banner,
                    "1200x400"
                  )}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
          <input
            name="banner"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setPreviewBanner(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-4 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
          />
        </div>

        {/* Logo y Color Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Logo Oficial
            </label>
            <div className="flex items-center gap-4">
              {(previewLogo || selectedStore.logo) &&
                (previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="Logo Preview"
                    className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 object-cover shadow-sm"
                  />
                ) : (
                  <SafeImage
                    src={getImageUrl(
                      selectedStore,
                      selectedStore.logo,
                      "100x100"
                    )}
                    alt="Logo"
                    className="w-16 h-16 rounded-2xl border border-slate-200 bg-slate-50 shrink-0 object-cover shadow-sm"
                  />
                ))}
              <input
                name="logo"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full bg-white border border-slate-200 rounded-full text-sm outline-none transition-colors file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-900 file:text-white hover:file:bg-slate-800 file:cursor-pointer text-slate-500 shadow-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full p-2 pr-6 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10 transition-all shadow-sm">
            <input
              name="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded-full border-0 cursor-pointer bg-transparent overflow-hidden"
            />
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 block">
                Color de Marca
              </label>
              <span className="text-sm font-mono text-slate-400">
                {primaryColor}
              </span>
            </div>
          </div>
        </div>

        {/* Ubicación y Descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Sede o Ubicación (Para filtros)
            </label>
            <input
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Valencia, Sambil"
              className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              URL de Google Maps (Opcional)
            </label>
            <input
              name="maps_url"
              type="url"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full bg-white border border-slate-200 rounded-full px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 shadow-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Descripción de la Marca (Bio)
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Somos distribuidores oficiales..."
              className="w-full bg-white border border-slate-200 rounded-3xl px-6 py-4 text-sm outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all text-slate-900 resize-none shadow-sm"
            ></textarea>
          </div>
        </div>

        {/* Selección de Categorías */}
        <div className="pt-8 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
            <Tag size={16} className="text-emerald-600" /> Categorías de tu
            Tienda (Obligatorio)
          </label>
          <p className="text-xs text-slate-400 mb-4">
            Selecciona al menos una categoría para que los compradores puedan
            encontrarte en el directorio.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allCategories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3 rounded-2xl border-2 text-sm font-bold transition-all text-left cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  <span className="block">{cat.name}</span>
                  {isSelected && (
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">
                      ✓ Seleccionado
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedCategories.length === 0 && (
            <p className="mt-2 text-xs text-red-500 font-bold">
              ⚠️ Debes seleccionar al menos una categoría.
            </p>
          )}
        </div>

        {/* Redes Sociales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-100">
          {/* WhatsApp */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-2">
              <MessageCircle size={16} className="text-emerald-600" /> WhatsApp
              Manager
            </label>
            <div className="flex rounded-full border border-slate-200 bg-white overflow-hidden focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10 transition-all shadow-sm">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-slate-50 border-r border-slate-200 px-3 py-4 text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneDigits}
                onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, ""))}
                placeholder="4141234567"
                className="w-full px-4 py-4 text-sm outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block">
              Instagram
            </label>
            <div className="flex rounded-full border border-slate-200 bg-white overflow-hidden focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10 transition-all shadow-sm">
              <span className="inline-flex items-center px-4 text-slate-500 font-bold bg-slate-50 border-r border-slate-200 text-sm select-none">
                @
              </span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace(/^@/, "").trim())}
                placeholder="tutienda"
                className="w-full px-4 py-4 text-sm outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdatingBrand}
          className="w-full bg-slate-900 text-white py-5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all mt-8 shadow-premium disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
        >
          {isUpdatingBrand
            ? "Guardando Cambios..."
            : "Guardar y Actualizar Marca"}
        </button>
      </form>
    </div>
  );
}