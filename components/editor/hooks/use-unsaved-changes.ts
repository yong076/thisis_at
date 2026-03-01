'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Detects unsaved changes and warns user before leaving.
 * Pass current values and original values to compare.
 */
export function useUnsavedChanges(current: string, original: string) {
  const [hasChanges, setHasChanges] = useState(false);
  const originalRef = useRef(original);

  // Update comparison when original changes (e.g. after save)
  const markSaved = useCallback(() => {
    originalRef.current = current;
    setHasChanges(false);
  }, [current]);

  useEffect(() => {
    const changed = current !== originalRef.current;
    setHasChanges(changed);
  }, [current]);

  // beforeunload warning
  useEffect(() => {
    if (!hasChanges) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  return { hasChanges, markSaved };
}
