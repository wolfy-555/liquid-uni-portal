import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export const PageWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`relative min-h-screen overflow-hidden bg-[var(--bg-primary)] ${className}`}>
    {/* Ambient glow ellipses */}
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute rounded-full"
        style={{
          width: 520, height: 420,
          background: 'var(--accent-glow-soft)',
          filter: 'blur(120px)',
          opacity: 0.55,
          transform: 'translateX(-30%) translateY(-20%)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 380, height: 320,
          background: 'var(--accent-blue-solid)',
          filter: 'blur(120px)',
          opacity: 0.35,
          transform: 'translateX(-10%) translateY(10%)',
        }}
      />
    </div>
    <motion.div
      className="relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  </div>
);
