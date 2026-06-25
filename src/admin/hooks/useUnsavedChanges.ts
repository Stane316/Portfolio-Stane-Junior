/**
 * useUnsavedChanges — Safe version (no useBlocker)
 * 
 * Compatible with the current BrowserRouter setup.
 * Only provides:
 * - hasChanges state
 * - beforeunload warning
 * - proceed/cancel (no-ops for compatibility with AdminContent)
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseUnsavedChangesReturn {
  hasChanges: boolean;
  setHasChanges: (value: boolean) => void;
  isBlocked: boolean;
  proceed: () => void;
  cancel: () => void;
}

export function useUnsavedChanges(): UseUnsavedChangesReturn {
  const hasChangesRef = useRef(false);
  const [hasChanges, setHasChangesState] = useState(false);

  const setHasChanges = useCallback((value: boolean) => {
    hasChangesRef.current = value;
    setHasChangesState(value);
  }, []);

  // beforeunload warning only (safe, no router dependency)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChangesRef.current) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const proceed = useCallback(() => {
    hasChangesRef.current = false;
    setHasChangesState(false);
  }, []);

  const cancel = useCallback(() => {
    // no-op (safe version)
  }, []);

  return {
    hasChanges,
    setHasChanges,
    isBlocked: false,
    proceed,
    cancel,
  };
}
