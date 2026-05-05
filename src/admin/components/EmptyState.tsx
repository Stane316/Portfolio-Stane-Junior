import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <div className="w-20 h-20 rounded-full bg-[#141430] border border-[rgba(0,191,255,0.15)] flex items-center justify-center mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-display font-bold text-white mb-2 text-center">{title}</h3>
      
      {/* Description */}
      <p className="text-[#A8B4C8] text-sm text-center max-w-sm mb-6">{description}</p>
      
      {/* Action */}
      {action && (
        <button onClick={action.onClick} className="btn-primary inline-flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;