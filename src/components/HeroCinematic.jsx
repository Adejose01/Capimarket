import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SPRING, SPRING_SLOW } from '../lib/utils';

export default function HeroCinematic({ onExplore }) {
  return (
    <section className="relative overflow-hidden bg-[#050505] w-full min-h-[70svh] sm:min-h-[540px] md:min-h-[600px] flex items-center">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse 80% 60% at 18% 50%, rgba(16,185,129,0.28), transparent 65%), radial-gradient(ellipse 60% 80% at 82% 30%, rgba(99,102,241,0.18), transparent 60%)' }} />
      {/* Top gradient: ensures navbar logo/text always visible */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent z-[5] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-10 lg:px-16 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24 flex flex-col items-center text-center gap-6 sm:gap-8">
        <motion.span 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.25 }} 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-extrabold uppercase tracking-widest text-white/70"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse inline-block" />
          Ecosistema de Comercio 2026
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ...SPRING_SLOW, delay: 0.15 }} 
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[0.92]"
        >
          CapiMercado:<br />
          Todo lo que buscas,<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#10b981,#34d399)' }}>en un solo lugar.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ...SPRING_SLOW, delay: 0.3 }} 
          className="text-sm sm:text-base text-white/50 max-w-lg leading-relaxed font-medium"
        >
          Desde el último smartphone hasta el repuesto que le falta a tu carro. El ecosistema premium de comercio en Venezuela.
        </motion.p>

        <motion.button 
          whileHover={{ scale: 1.04 }} 
          whileTap={{ scale: 0.97 }} 
          transition={SPRING} 
          onClick={onExplore} 
          className="flex items-center gap-3 bg-white text-[#050505] px-8 py-4 rounded-full font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-shadow"
        >
          Explorar Ahora <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </section>
  );
}
