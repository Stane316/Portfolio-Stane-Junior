import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string, duration: number = 4000): void => {
    const id: string = Date.now().toString() + Math.random().toString(36).substring(7);
    setToasts((prev: Toast[]) => [...prev, { id, type, message, duration }]);
    
    setTimeout((): void => {
      setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string): void => {
    setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};