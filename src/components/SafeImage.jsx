import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function SafeImage({ src, alt, className, fallbackIcon = <ImageIcon size={32} /> }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
        {fallbackIcon}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
