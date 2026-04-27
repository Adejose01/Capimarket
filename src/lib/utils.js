import pb from './pocketbase';

// ============================================================================
// SPRING ANIMATION PHYSICS — Configuración compartida
// ============================================================================
export const SPRING = { type: 'spring', stiffness: 300, damping: 22 };
export const SPRING_SLOW = { type: 'spring', stiffness: 180, damping: 18 };

// ============================================================================
// HELPERS DE IMÁGENES — PocketBase File URL
// ============================================================================
export const getImageUrl = (record, filename, thumb = '0x0') => {
  if (!record || !filename) return null;
  return pb.files.getURL(record, filename, { thumb });
};

// ============================================================================
// LÓGICA DE CONTACTO — Limpiador WhatsApp High-End
// ============================================================================
export const formatWhatsAppNumber = (phone) => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, ''); // Eliminar caracteres no numéricos
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1); // Quitar '0' inicial si existe
  if (!cleaned.startsWith('58')) cleaned = '58' + cleaned; // Forzar prefijo 58
  return cleaned;
};
