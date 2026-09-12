import React from 'react';

// Skeleton Loader para productos — mejora percepción de velocidad mientras los datos
// se cargan desde PocketBase. Diseñado para coincidir con el aspect-ratio de ProductCard.
export default function ProductSkeleton() {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-100 animate-pulse">
      <div className="w-full aspect-square bg-slate-200 rounded-2xl" />
      <div className="h-4 bg-slate-200 rounded-full w-3/4 mt-4" />
      <div className="h-6 bg-slate-200 rounded-full w-1/2 mt-2" />
    </div>
  );
}
