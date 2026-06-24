/**
 * useUnsavedChanges — Detects unsaved changes and warns before navigation
 *
 * P-05 FIX: Implements beforeunload + React Router blocking
 *
 * Usage:
 *   const { hasChanges, setHasChanges } = useUnsavedChanges();
 *   // When user edits, call setHasChanges(true)
 *   // When saved, call setHasChanges(false)
 *   // The hook automatically shows browser warning on tab close / URL change
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useBlocker } from 'react-router-dom';

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

  // Block React Router navigation when there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return hasChangesRef.current && currentLocation.pathname !== nextLocation.pathname;
    }
  );

  const isBlocked = blocker.state === 'blocked';

  const proceed = useCallback(() => {
    hasChangesRef.current = false;
    setHasChangesState(false);
    blocker.proceed?.();
  }, [blocker]);

  const cancel = useCallback(() => {
    blocker.reset?.();
  }, [blocker]);

  // beforeunload — warn when closing tab / refreshing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChangesRef.current) {
        e.preventDefault();
        // Modern browsers ignore custom messages but require returnValue
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    hasChanges,
    setHasChanges,
    isBlocked,
    proceed,
    cancel,
  };
}
