import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SPRING, SPRING_SLOW } from '../lib/utils';

export default function HeroCinematic({ onExplore }) {
  return (
    <section className="relative overflow-hidden bg-[#050505] w-full min-h-[100svh] sm:min-h-[640px] md:min-h-[720px] flex items-end sm:items-center">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 60% at 18% 50%, rgba(16,185,129,0.28), transparent 65%), radial-gradient(ellipse 60% 80% at 82% 30%, rgba(99,102,241,0.18), transparent 60%)' }} />
      {/* Top gradient: ensures navbar logo/text always visible */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent z-[5] pointer-events-none" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-20 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-0">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING_SLOW, delay: 0.1 }} className="flex flex-col gap-4 sm:gap-6 text-center md:text-left">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="inline-flex items-center gap-2 self-center md:self-start px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-extrabold uppercase tracking-widest text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-green animate-pulse inline-block" />
            Nueva Coleccion 2026
          </motion.span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white leading-[0.92] italic">
            Tecnologia<br />
            <span className="not-italic text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#10b981,#34d399)' }}>de Lujo.</span>
          </h1>
          <p className="text-sm text-white/50 max-w-xs mx-auto md:mx-0 leading-relaxed font-medium">El ecosistema premium de tecnologia de Venezuela. Marcas certificadas, precios transparentes.</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING} onClick={onExplore} className="self-center md:self-start flex items-center gap-3 bg-white text-[#050505] px-7 py-3.5 sm:px-8 sm:py-4 rounded-full font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-shadow">
            Explorar Ahora <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
        <div className="relative flex items-end justify-center h-[180px] sm:h-[320px] md:h-[400px]">
          <div className="hero-ground-shadow absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-8 sm:h-10" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING_SLOW, delay: 0.3 }} className="animate-float absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] max-w-[260px] sm:max-w-[320px]">
            <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=90&w=900" alt="Luxury Tech" className="hero-float w-full h-full object-contain select-none" draggable={false} />
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING, delay: 0.65 }} className="glass-card absolute top-3 right-3 sm:top-6 sm:right-6 rounded-xl sm:rounded-2xl px-4 py-3 flex flex-col">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Disponible</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">+500 Items</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
