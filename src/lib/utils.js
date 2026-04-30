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

import { Smartphone, Laptop, Headphones, Package, Car, Home, Dumbbell, Smartphone as Phone, Wrench, Shirt } from 'lucide-react';

export const getCategoryIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes('electrónica') || n.includes('tech')) return Smartphone;
  if (n.includes('deportes')) return Dumbbell;
  if (n.includes('vehículos') || n.includes('camioneta')) return Car;
  if (n.includes('hogar') || n.includes('mueble')) return Home;
  if (n.includes('repuesto') || n.includes('herramienta')) return Wrench;
  if (n.includes('ropa') || n.includes('moda')) return Shirt;
  if (n.includes('phone')) return Phone;
  if (n.includes('laptop')) return Laptop;
  if (n.includes('audio')) return Headphones;
  return Package;
};

/**
 * Sanitiza texto para prevenir XSS básico. 
 * Aunque React escapa por defecto, este blindaje adicional limpia el input.
 */
export const sanitizeText = (text = "") => {
  if (typeof text !== 'string') return "";
  return text
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") // Quitar scripts
    .replace(/on\w+="[^"]*"/gim, "") // Quitar event handlers inline
    .replace(/javascript:[^"]*/gim, "") // Quitar protocolos javascript:
    .trim();
};
