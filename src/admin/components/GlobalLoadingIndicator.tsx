import React from 'react';
import { motion } from 'framer-motion';

interface GlobalLoadingIndicatorProps {
  isLoading: boolean;
}

const GlobalLoadingIndicator: React.FC<GlobalLoadingIndicatorProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0A0A1E] bg-opacity-80 flex items-center justify-center"
    >
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#00BFFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-white font-semibold">Chargement en cours...</p>
      </div>
    </motion.div>
  );
};

export default GlobalLoadingIndicator;