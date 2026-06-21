/**
 * useToast — Hook pour gérer les notifications toast dans l'admin
 *
 * Durées par type :
 * - success : 3s (feedback rapide)
 * - error   : 6s (doit être lu)
 * - info    : 4s
 * - warning : 5s
 */

import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  error: 6000,
  info: 4000,
  warning: 5000,
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7);
    const toastDuration = duration ?? DEFAULT_DURATIONS[type];
    setToasts((prev) => [...prev, { id, type, message, duration: toastDuration }]);
    
    // Safety net: remove toast after duration + 1s buffer
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toastDuration + 1000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
