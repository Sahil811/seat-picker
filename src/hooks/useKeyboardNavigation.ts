import { useCallback } from 'react';

export type KeyboardNavOptions = {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onFit?: () => void;
  onPanBy?: (dxPx: number, dyPx: number) => void;
  clearSelection?: () => void;
};

export const useKeyboardNavigation = (opts: KeyboardNavOptions = {}) => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    const { onZoomIn, onZoomOut, onReset, onFit, onPanBy, clearSelection } = opts;

    // Normalize key
    const key = event.key;

    // Pan with arrows (Shift speeds up)
    const panStep = event.shiftKey ? 120 : 60;
    if (key === 'ArrowLeft') {
      onPanBy?.(panStep, 0); // move content right -> viewport left
      event.preventDefault();
      return;
    }
    if (key === 'ArrowRight') {
      onPanBy?.(-panStep, 0); // move content left -> viewport right
      event.preventDefault();
      return;
    }
    if (key === 'ArrowUp') {
      onPanBy?.(0, panStep); // move content down -> viewport up
      event.preventDefault();
      return;
    }
    if (key === 'ArrowDown') {
      onPanBy?.(0, -panStep); // move content up -> viewport down
      event.preventDefault();
      return;
    }

    // Zoom shortcuts
    if (key === '+' || key === '=') {
      onZoomIn?.();
      event.preventDefault();
      return;
    }
    if (key === '-' || key === '_') {
      onZoomOut?.();
      event.preventDefault();
      return;
    }

    // Fit / Reset
    if (key === 'f' || key === 'F') {
      onFit?.();
      event.preventDefault();
      return;
    }
    if (key === '0') {
      onReset?.();
      event.preventDefault();
      return;
    }

    // Clear selection
    if (key === 'Escape') {
      clearSelection?.();
      event.preventDefault();
      return;
    }
  }, [opts]);
  
  return { handleKeyDown };
};