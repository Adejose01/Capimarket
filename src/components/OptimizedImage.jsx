import React from 'react';

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
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      // Lazy loading nativo: 'lazy' por defecto, 'eager' si es prioridad
      loading={priority ? "eager" : "lazy"}
      // Prioridad de carga para LCP
      fetchpriority={priority ? "high" : "low"}
      // Decodificación asíncrona para no bloquear el hilo principal
      decoding="async"
      // Configuración de tamaños para responsive
      sizes={sizes}
      {...props}
    />
  );
}
