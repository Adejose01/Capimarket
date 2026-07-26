import pb from "@/lib/pocketbase";
import * as LucideIcons from "lucide-react";
import type { BaseRecord } from "@/lib/types/pocketbase";
import { LucideIcon } from "lucide-react";

// ============================================================================
// SPRING ANIMATION PHYSICS — Configuración compartida con as const
// ============================================================================
export const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;
export const SPRING_SLOW = {
  type: "spring",
  stiffness: 180,
  damping: 18,
} as const;

/**
 * Convierte cualquier string (ej: "smart-phone", "smartphone", "laptop")
 * a PascalCase ("Smartphone", "Laptop").
 */
const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/[\s\-_]+/g, "");
};

export const getImageUrl = (
  record?: BaseRecord | null,
  filename?: string,
  thumb = "0x0",
): string | undefined => {
  if (!record || !filename) return undefined;
  return pb.files.getURL(record, filename, { thumb });
};

export const formatWhatsAppNumber = (phone?: string): string => {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith("58")) cleaned = "58" + cleaned;
  return cleaned;
};

/**
 * Resuelve el icono de Lucide en tiempo de ejecución.
 *
 * @param iconName Nombre del icono según Lucide (ej: "Laptop", "Shirt", "Camera")
 * @param fallbackName Palabra clave opcional de respaldo si iconName no existe
 */
export const getCategoryIcon = (iconName?: string): LucideIcon => {
  if (!iconName) return LucideIcons.Package;

  const formattedName = toPascalCase(iconName.trim());
  const iconsMap = LucideIcons as unknown as Record<string, LucideIcon>;

  if (formattedName in iconsMap) {
    return iconsMap[formattedName] ?? LucideIcons.Package;
  }

  return LucideIcons.Package;
};

export const sanitizeText = (text = ""): string => {
  if (typeof text !== "string") return "";
  return text
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/on\w+="[^"]*"/gim, "")
    .replace(/javascript:[^"]*/gim, "")
    .trim();
};
