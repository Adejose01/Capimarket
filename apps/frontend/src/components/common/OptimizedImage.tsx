import React from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Componente de Imagen Optimizado (Equivalente a next/image para Vite/React)
 * Implementa Lazy Loading, decodificación asíncrona y soporte para prioridades.
 */
export default function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "100vw",
  ...props
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      // Lazy loading nativo: 'lazy' por defecto, 'eager' si es prioridad
      loading={priority ? "eager" : "lazy"}
      // Prioridad de carga para LCP
      fetchPriority={priority ? "high" : "low"}
      // Decodificación asíncrona para no bloquear el hilo principal
      decoding="async"
      // Configuración de tamaños para responsive
      sizes={sizes}
      {...props}
    />
  );
}
