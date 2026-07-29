import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Send,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Loader2,
  UserCheck,
  History,
  Clock,
  ChevronDown,
  ChevronUp,
  Inbox,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import pb from "@/lib/pocketbase";
import { contactService } from "@/lib/services/pb/contact.service";
import type { ContactTicket } from "@/lib/types/pocketbase";

export default function ContactView() {
  const navigate = useNavigate();
  const currentUser = pb.authStore.record;

  // Control de pestañas
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    reasonOption: "sugerencia",
    customReason: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado del Historial de Tickets
  const [tickets, setTickets] = useState<ContactTicket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!currentUser?.id) return;
    setIsLoadingTickets(true);
    try {
      const data = await contactService.getByUser(currentUser.id);
      setTickets(data);
    } catch (error) {
      console.error("Error al cargar los tickets:", error);
    } finally {
      setIsLoadingTickets(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchTickets();
    }
  }, [currentUser?.id, fetchTickets]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser?.id) {
      setErrorMessage("Debes estar autenticado para enviar una solicitud.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const finalReason =
      formData.reasonOption === "otro"
        ? formData.customReason.trim()
        : formData.reasonOption;

    try {
      await contactService.create({
        user: currentUser.id,
        name: formData.name.trim(),
        reason: finalReason,
        message: formData.message.trim(),
      });

      setIsSuccess(true);
      setFormData({
        name: currentUser?.name || "",
        reasonOption: "sugerencia",
        customReason: "",
        message: "",
      });

      // Recargar la lista de tickets
      fetchTickets();
    } catch (error) {
      console.error("Error al enviar mensaje de contacto:", error);
      setErrorMessage(
        "Ocurrió un error al enviar tu mensaje. Por favor intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTicketExpand = (id: string) => {
    setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar isScrolled={true} variant="minimal" />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Botón Volver */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          {/* Encabezado */}
          <header className="mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
              <Mail className="text-emerald-500" size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight tracking-tight">
              Centro de Atención y Soporte
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Ponte en contacto con nuestro equipo o gestiona el estado de tus
              solicitudes abiertas.
            </p>
          </header>

          {/* Navegación por Pestañas (Tabs) */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "new"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <Send size={15} /> Nuevo Mensaje
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                activeTab === "history"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <History size={15} /> Mis Solicitudes
              {tickets.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-black">
                  {tickets.length}
                </span>
              )}
            </button>
          </div>

          {/* CONTENIDO: Pestaña Nuevo Mensaje */}
          {activeTab === "new" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                {isSuccess ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      ¡Mensaje enviado con éxito!
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Muchas gracias por contactarnos. Hemos recibido tu
                      solicitud y la revisaremos a la brevedad.
                    </p>
                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        onClick={() => setIsSuccess(false)}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Enviar otro mensaje
                      </button>
                      <button
                        onClick={() => {
                          setIsSuccess(false);
                          setActiveTab("history");
                        }}
                        className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:bg-slate-200 cursor-pointer"
                      >
                        Ver mis solicitudes
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl text-xs font-medium text-red-600 dark:text-red-400">
                        {errorMessage}
                      </div>
                    )}

                    {/* Cuenta Vinculada */}
                    <div className="p-4 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                          Cuenta vinculada
                        </p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
                          {currentUser?.email || "Sin correo asociado"}
                        </p>
                      </div>
                      <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[11px] font-bold">
                        <UserCheck size={13} /> Autenticado
                      </span>
                    </div>

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
                        Motivo del Mensaje
                      </label>
                      <select
                        name="reasonOption"
                        value={formData.reasonOption}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value="sugerencia">
                          Enviar una Sugerencia o Idea
                        </option>
                        <option value="error">Reportar un Error (Bug)</option>
                        <option value="ayuda">
                          Soporte con mi Cuenta / Catálogo
                        </option>
                        <option value="otro">Otro Motivo</option>
                      </select>
                    </div>

                    {formData.reasonOption === "otro" && (
                      <div className="animate-in fade-in duration-200">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Especifique el motivo
                        </label>
                        <input
                          type="text"
                          name="customReason"
                          required
                          value={formData.customReason}
                          onChange={handleChange}
                          placeholder="Ej. Consulta comercial, Alianza, etc."
                          className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white"
                        />
                      </div>
                    )}

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
                        placeholder="Escribe detalladamente tu mensaje..."
                        className="w-full bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 cursor-pointer active:scale-98"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Mensaje <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Sidebar Informativo */}
              <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-slate-900 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-emerald-500" size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">
                      Atención Directa
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Cada solicitud queda registrada directamente en nuestro
                    sistema asociada a tu cuenta. Esto nos permite brindarte un
                    seguimiento oportuno y personalizado.
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-[#111111] border border-slate-100 dark:border-slate-900 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="text-emerald-500" size={18} />
                    <h3 className="font-bold text-sm uppercase tracking-wider">
                      ¿Qué incluir?
                    </h3>
                  </div>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-3 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        <strong>Errores:</strong> Pasos exactos para reproducir
                        el inconveniente o el comportamiento esperado.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>
                        <strong>Sugerencias:</strong> Explicación de cómo la
                        nueva función facilitaría la gestión de tu tienda.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO: Pestaña Historial de Tickets */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {isLoadingTickets ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Loader2
                    size={32}
                    className="animate-spin mb-3 text-emerald-500"
                  />
                  <p className="text-xs font-medium uppercase tracking-wider">
                    Cargando tus solicitudes...
                  </p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-[#111111] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl space-y-3">
                  <Inbox
                    size={40}
                    className="mx-auto text-slate-300 dark:text-slate-600"
                  />
                  <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                    Aún no has realizado ninguna solicitud
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Tus consultas y reportes enviados aparecerán listados aquí
                    para que puedas seguir su estado.
                  </p>
                  <button
                    onClick={() => setActiveTab("new")}
                    className="mt-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    Crear primera solicitud
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => {
                    const isExpanded = expandedTicketId === ticket.id;
                    return (
                      <div
                        key={ticket.id}
                        className="bg-slate-50 dark:bg-[#111111] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all duration-200"
                      >
                        {/* Cabecera del Item */}
                        <div
                          onClick={() => toggleTicketExpand(ticket.id)}
                          className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Badge de Estado: active (true) -> En proceso, active (false) -> Resuelto */}
                            {ticket.active ? (
                              <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-[11px] font-bold">
                                <Clock size={12} /> En Proceso
                              </span>
                            ) : (
                              <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-[11px] font-bold">
                                <CheckCircle size={12} /> Resuelto
                              </span>
                            )}

                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">
                                {ticket.reason}
                              </h4>
                              <p className="text-[11px] font-medium text-slate-400">
                                {formatDate(ticket.created)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                              #{ticket.id.slice(0, 8)}
                            </span>
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-slate-400" />
                            ) : (
                              <ChevronDown
                                size={18}
                                className="text-slate-400"
                              />
                            )}
                          </div>
                        </div>

                        {/* Cuerpo Desplegable (Detalles) */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-black/20 text-xs leading-relaxed space-y-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                Mensaje Enviado
                              </p>
                              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-xl font-sans">
                                {ticket.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
