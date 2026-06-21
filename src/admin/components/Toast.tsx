/**
 * Toast System — Notifications premium avec icônes SVG
 * 
 * Améliorations :
 * - Icônes SVG au lieu d'emojis (rendu cohérent)
 * - Animation d'entrée/sortie premium
 * - Barre de progression visuelle
 * - Accessibilité ARIA
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
};

const STYLES = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/20',
    barColor: 'bg-emerald-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    iconBg: 'bg-red-500/20',
    barColor: 'bg-red-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    iconBg: 'bg-blue-500/20',
    barColor: 'bg-blue-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/20',
    barColor: 'bg-amber-400',
  },
};

const ToastComponent: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const style = STYLES[toast.type];
  const icon = ICONS[toast.type];
  const duration = toast.duration || 4000;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(4px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 60, scale: 0.9, filter: 'blur(4px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`${style.bg} ${style.border} border rounded-xl p-4 mb-3 max-w-sm shadow-2xl backdrop-blur-md`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${style.iconBg} rounded-lg p-2 flex-shrink-0 ${style.text}`}>
          {icon}
        </div>

        {/* Message */}
        <p className={`${style.text} text-sm flex-1 pt-1.5 leading-snug`}>{toast.message}</p>

        {/* Close */}
        <button
          onClick={() => onRemove(toast.id)}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0 p-1 rounded-md hover:bg-white/5`}
          title="Fermer"
          aria-label="Fermer la notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${style.barColor} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          onAnimationComplete={() => onRemove(toast.id)}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end" aria-live="polite" aria-label="Notifications">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};
