import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SlideLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  step?: number;
}

export const SlideLayout: React.FC<SlideLayoutProps> = ({ children, title, subtitle, step }) => {
  return (
    <div className="w-full h-screen flex flex-col p-8 md:p-12 relative overflow-hidden bg-background">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 mb-8 border-b border-white/10 pb-4"
      >
        {title && (
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {title}
          </h1>
        )}
        {subtitle && (
          <h2 className="text-xl md:text-2xl text-primary font-mono mt-2">
            {subtitle}
          </h2>
        )}
      </motion.div>

      {/* Content Area */}
      <motion.div 
        className="flex-1 z-10 relative flex flex-col justify-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Footer / Progress */}
      <div className="absolute bottom-6 right-12 z-10 text-xs font-mono text-gray-500">
        MayankRaj.com // GENAI_AT_SCALE
      </div>
    </div>
  );
};