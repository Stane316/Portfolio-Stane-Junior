/**
 * useDebouncedSave — Hook pour auto-save avec debounce
 *
 * Au lieu de sauvegarder à chaque frappe (onKeyUp → upsert),
 * on attend que l'utilisateur arrête de taper pendant `delay` ms.
 * 
 * Affiche aussi un état "saving" / "saved" pour le feedback UX.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDebouncedSaveReturn {
  /** Appeler à chaque changement de valeur */
  scheduleSave: (value: string) => void;
  /** L'état actuel de la sauvegarde */
  saveStatus: 'idle' | 'saving' | 'saved';
  /** La valeur locale (optimiste) */
  localValue: string;
  /** Pour forcer la mise à jour de la valeur locale depuis l'extérieur */
  setLocalValue: (value: string) => void;
}

export function useDebouncedSave(
  onSave: (value: string) => Promise<void>,
  initialValue: string = '',
  delay: number = 800
): UseDebouncedSaveReturn {
  const [localValue, setLocalValue] = useState(initialValue);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveRef = useRef(onSave);

  // Garder la référence à onSave à jour
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Mettre à jour localValue si initialValue change (depuis Supabase)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const scheduleSave = useCallback((value: string) => {
    setLocalValue(value);
    setSaveStatus('idle');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await onSaveRef.current(value);
        setSaveStatus('saved');
        // Reset status after 2s
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        console.error('Debounced save error:', error);
        setSaveStatus('idle');
      }
    }, delay);
  }, [delay]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { scheduleSave, saveStatus, localValue, setLocalValue };
}
