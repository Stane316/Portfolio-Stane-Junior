import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  onCancel,
  type = 'danger',
}) => {
  const typeStyles = {
    danger: { icon: '🗑️', color: 'text-red-400', bg: 'bg-red-500 bg-opacity-20', border: 'border-red-500' },
    warning: { icon: '⚠️', color: 'text-yellow-400', bg: 'bg-yellow-500 bg-opacity-20', border: 'border-yellow-500' },
    info: { icon: 'ℹ️', color: 'text-blue-400', bg: 'bg-blue-500 bg-opacity-20', border: 'border-blue-500' },
  };

  const style = typeStyles[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative glass-card max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                {style.icon}
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-1">{title}</h3>
                <p className="text-[#A8B4C8] text-sm">{message}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={onCancel}
                className="btn-secondary text-sm py-2 px-4"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`btn-primary text-sm py-2 px-4 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : ''}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;