import { useCallback, useMemo, useRef, useState } from 'react';

type Handlers = {
  onWheel: React.WheelEventHandler<SVGSVGElement>;
  onMouseDown: React.MouseEventHandler<SVGSVGElement>;
  onMouseMove: React.MouseEventHandler<SVGSVGElement>;
  onMouseUp: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave: React.MouseEventHandler<SVGSVGElement>;
  onTouchStart: React.TouchEventHandler<SVGSVGElement>;
  onTouchMove: React.TouchEventHandler<SVGSVGElement>;
  onTouchEnd: React.TouchEventHandler<SVGSVGElement>;
};

export type ViewBoxDims = { width: number; height: number };

// This hook manages pan/zoom using proper SVG unit conversions, ensuring consistent feel across scales.
export const useZoom = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  viewBox?: ViewBoxDims
) => {
  const [{ scale, tx, ty }, set] = useState({ scale: 1, tx: 0, ty: 0 });
  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number>(0);
  const MIN = 0.4;
  const MAX = 6;

  const clamp = useCallback((v: number, min: number, max: number) => Math.min(max, Math.max(min, v)), []);

  const getMetrics = useCallback(() => {
    const el = svgRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const vbW = viewBox?.width ?? rect.width;
    const vbH = viewBox?.height ?? rect.height;
    const baseScale = rect.width / vbW; // px per svg unit without our custom scale
    return { rect, vbW, vbH, baseScale };
  }, [svgRef, viewBox?.width, viewBox?.height]);

  const screenToUser = useCallback((sx: number, sy: number, state?: { scale: number; tx: number; ty: number }) => {
    const m = getMetrics();
    if (!m) return { ux: 0, uy: 0 };
    const s = state?.scale ?? scale;
    const _tx = state?.tx ?? tx;
    const _ty = state?.ty ?? ty;
    const { rect, baseScale } = m;
    const px = sx - rect.left;
    const py = sy - rect.top;
    const ux = px / (s * baseScale) - _tx;
    const uy = py / (s * baseScale) - _ty;
    return { ux, uy };
  }, [getMetrics, scale, tx, ty]);

  const zoomIn = useCallback(() => set((s) => ({ ...s, scale: clamp(s.scale * 1.2, MIN, MAX) })), [clamp]);
  const zoomOut = useCallback(() => set((s) => ({ ...s, scale: clamp(s.scale / 1.2, MIN, MAX) })), [clamp]);
  const reset = useCallback(() => set({ scale: 1, tx: 0, ty: 0 }), []);

  const fitToScreen = useCallback((paddingPct = 0.92) => {
    const m = getMetrics();
    if (!m) return;
    const { rect, vbW, vbH, baseScale } = m;
    const targetOverall = Math.min((rect.width * paddingPct) / vbW, (rect.height * paddingPct) / vbH);
    const s = clamp(targetOverall / baseScale, MIN, MAX);
    const screenLeft = (rect.width - vbW * baseScale * s) / 2;
    const screenTop = (rect.height - vbH * baseScale * s) / 2;
    const newTx = screenLeft / (s * baseScale);
    const newTy = screenTop / (s * baseScale);
    set({ scale: s, tx: newTx, ty: newTy });
  }, [getMetrics, clamp]);

  const onWheel: React.WheelEventHandler<SVGSVGElement> = useCallback((e) => {
    e.preventDefault();
    const m = getMetrics();
    if (!m) return;
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    set((s) => {
      const newScale = clamp(s.scale * factor, MIN, MAX);
      const { ux, uy } = screenToUser(e.clientX, e.clientY, s);
      // keep (ux,uy) under cursor stable after zoom
      const { baseScale, rect } = m;
      const newTx = (e.clientX - rect.left) / (newScale * baseScale) - ux;
      const newTy = (e.clientY - rect.top) / (newScale * baseScale) - uy;
      return { scale: newScale, tx: newTx, ty: newTy };
    });
  }, [clamp, getMetrics, screenToUser]);

  const onMouseDown: React.MouseEventHandler<SVGSVGElement> = useCallback((e) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove: React.MouseEventHandler<SVGSVGElement> = useCallback((e) => {
    if (!dragging.current) return;
    const m = getMetrics();
    if (!m) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    set((s) => ({
      ...s,
      tx: s.tx + dx / (s.scale * m.baseScale),
      ty: s.ty + dy / (s.scale * m.baseScale),
    }));
  }, [getMetrics]);

  const stopDrag = useCallback(() => {
    dragging.current = false;
  }, []);

  // Touch event handlers for mobile support
  const onTouchStart: React.TouchEventHandler<SVGSVGElement> = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      // Single touch - start dragging
      dragging.current = true;
      const touch = e.touches[0];
      last.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      dragging.current = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      lastTouchDistance.current = distance;
    }
  }, []);

  const onTouchMove: React.TouchEventHandler<SVGSVGElement> = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging.current) {
      // Single touch - pan
      const m = getMetrics();
      if (!m) return;
      const touch = e.touches[0];
      const dx = touch.clientX - last.current.x;
      const dy = touch.clientY - last.current.y;
      last.current = { x: touch.clientX, y: touch.clientY };
      set((s) => ({
        ...s,
        tx: s.tx + dx / (s.scale * m.baseScale),
        ty: s.ty + dy / (s.scale * m.baseScale),
      }));
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (lastTouchDistance.current > 0) {
        const scaleChange = distance / lastTouchDistance.current;
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        
        // Get the point in user coordinates before zoom
        const beforeZoom = screenToUser(centerX, centerY);
        
        set((s) => {
          const newScale = clamp(s.scale * scaleChange, MIN, MAX);
          // Get the point in user coordinates after zoom
          const afterZoom = screenToUser(centerX, centerY, { scale: newScale, tx: s.tx, ty: s.ty });
          
          return {
            scale: newScale,
            tx: s.tx + (beforeZoom.ux - afterZoom.ux),
            ty: s.ty + (beforeZoom.uy - afterZoom.uy),
          };
        });
      }
      
      lastTouchDistance.current = distance;
    }
  }, [getMetrics, screenToUser, clamp]);

  const onTouchEnd: React.TouchEventHandler<SVGSVGElement> = useCallback((e) => {
    e.preventDefault();
    dragging.current = false;
    lastTouchDistance.current = 0;
  }, []);

  // Allow programmatic panning by pixel amounts (converted to SVG user units)
  const panBy = useCallback((dxPx: number, dyPx: number) => {
    const m = getMetrics();
    if (!m) return;
    set((s) => ({
      ...s,
      tx: s.tx + dxPx / (s.scale * m.baseScale),
      ty: s.ty + dyPx / (s.scale * m.baseScale),
    }));
  }, [getMetrics]);

  const handlers: Handlers = useMemo(
    () => ({ 
      onWheel, 
      onMouseDown, 
      onMouseMove, 
      onMouseUp: stopDrag, 
      onMouseLeave: stopDrag,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }),
    [onWheel, onMouseDown, onMouseMove, stopDrag, onTouchStart, onTouchMove, onTouchEnd]
  );

  const transform = useMemo(() => `translate(${tx}, ${ty}) scale(${scale})`, [tx, ty, scale]);

  return { transform, zoomIn, zoomOut, reset, fitToScreen, panBy, handlers };
};