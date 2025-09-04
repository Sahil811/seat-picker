import { useCallback, useMemo, useRef, useState } from 'react';

type Handlers = {
  onWheel: React.WheelEventHandler<SVGSVGElement>;
  onMouseDown: React.MouseEventHandler<SVGSVGElement>;
  onMouseMove: React.MouseEventHandler<SVGSVGElement>;
  onMouseUp: React.MouseEventHandler<SVGSVGElement>;
  onMouseLeave: React.MouseEventHandler<SVGSVGElement>;
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
  const MIN = 0.4;
  const MAX = 6;

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

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

  const zoomIn = useCallback(() => set((s) => ({ ...s, scale: clamp(s.scale * 1.2, MIN, MAX) })), []);
  const zoomOut = useCallback(() => set((s) => ({ ...s, scale: clamp(s.scale / 1.2, MIN, MAX) })), []);
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
  }, [getMetrics]);

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
    () => ({ onWheel, onMouseDown, onMouseMove, onMouseUp: stopDrag, onMouseLeave: stopDrag }),
    [onWheel, onMouseDown, onMouseMove, stopDrag]
  );

  const transform = useMemo(() => `translate(${tx}, ${ty}) scale(${scale})`, [tx, ty, scale]);

  return { transform, zoomIn, zoomOut, reset, fitToScreen, panBy, handlers };
};