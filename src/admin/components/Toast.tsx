import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toast, ToastType } from '../hooks/useToast';

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const colors = {
    success: { bg: 'bg-cyan-500 bg-opacity-20', border: 'border-cyan-500', text: 'text-cyan-400', icon: '✅' },
    error: { bg: 'bg-red-500 bg-opacity-20', border: 'border-red-500', text: 'text-red-400', icon: '❌' },
    info: { bg: 'bg-blue-500 bg-opacity-20', border: 'border-blue-500', text: 'text-blue-400', icon: 'ℹ️' },
    warning: { bg: 'bg-yellow-500 bg-opacity-20', border: 'border-yellow-500', text: 'text-yellow-400', icon: '⚠️' },
  };

  const style = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-3 max-w-sm shadow-lg backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0">{style.icon}</span>
        <p className={`${style.text} text-sm flex-1`}>{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Progress bar */}
      <motion.div
        className={`h-1 ${style.border} rounded-full mt-2 origin-left`}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration || 4000) / 1000, ease: 'linear' }}
        onAnimationComplete={() => onRemove(toast.id)}
      />
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};