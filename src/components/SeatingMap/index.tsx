import React, { useEffect, useRef, useState } from 'react';
import { useSeatingMap } from '../../hooks/useSeatingMap';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { VirtualizedSeats } from './VirtualizedSeats';
import type { Section, Seat } from '../../types/venue';
import { ZoomControls } from '../Navigation/ZoomControls';
import { useZoom } from '../../hooks/useZoom';
import { useSeatingStore } from '../../store/seatingStore';

export const SeatingMap: React.FC = () => {
  const { venue, selectedSeats, totalPrice } = useSeatingMap();
  const { deselectSeat, clearSelection } = useSeatingStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { transform, zoomIn, zoomOut, reset, fitToScreen, panBy, handlers } = useZoom(svgRef, venue?.map);
  const { handleKeyDown } = useKeyboardNavigation({
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onReset: reset,
    onFit: fitToScreen,
    onPanBy: panBy,
    clearSelection,
  });
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    // Fit when venue loads
    if (venue) {
      // Defer to next tick to ensure SVG has layout
      setTimeout(() => fitToScreen(), 0);
    }
  }, [venue, fitToScreen]);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 2500);
    return () => clearTimeout(t);
  }, []);
  
  if (!venue) return <div className="text-gray-600">Loading venue...</div>;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-220px)] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md ring-1 ring-gray-100 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={`${venue?.name} seating map`}
      aria-roledescription="Interactive, zoom-enabled seating map. Use mouse wheel or +/− to zoom, click-drag or arrow keys to pan, and click seats to select."
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${venue?.map.width} ${venue?.map.height}`}
        className="border-none bg-gray-50"
        {...handlers}
      >
        {/* Defs for subtle selected-seat shadow */}
        <defs>
          <filter id="seatShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="#1d4ed8" floodOpacity="0.25" />
          </filter>
        </defs>

        <g transform={transform}>
          {/* Stage label for orientation */}
          <g transform={`translate(${venue.map.width / 2 - 70}, 8)`} aria-label="Stage">
            <rect width="140" height="22" rx="11" fill="#111827" opacity="0.9" />
            <text x="70" y="15" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="Inter, Roboto, system-ui">STAGE</text>
          </g>

          {venue.sections.map((section: Section) => (
            <g key={section.id} transform={`translate(${section?.transform.x}, ${section?.transform.y}) scale(${section?.transform.scale})`}>
              <VirtualizedSeats section={section} />
            </g>
          ))}
        </g>
      </svg>
      
      <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={reset} onFit={fitToScreen} />

      {/* Hint overlay */}
      {showHint && (
        <div className="pointer-events-none absolute top-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 px-3 py-2 text-xs text-gray-700 transition-opacity duration-700">
          Scroll to zoom • Drag to pan • Arrow keys pan • +/- zoom • F fit • 0 reset
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3.5 w-3.5 rounded-[4px] bg-emerald-500/90 border border-emerald-600" />
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3.5 w-3.5 rounded-[4px] bg-blue-500/90 border border-blue-700" />
            <span className="text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3.5 w-3.5 rounded-[4px] bg-amber-400/80 border border-amber-600" />
            <span className="text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-3.5 w-3.5 rounded-[4px] bg-red-500/80 border border-red-700" />
            <span className="text-gray-700">Sold</span>
          </div>
        </div>
      </div>
      
      {/* Selection Summary */}
      <div className="absolute bottom-5 right-5 w-80 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-gray-200 font-sans">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Your Selection</h3>
          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
            {selectedSeats.length}/8
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
          {selectedSeats.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">No seats selected yet</div>
          ) : (
            selectedSeats.map((seat: Seat) => (
              <div key={seat.id} className="px-4 py-3 text-sm flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-blue-100 border border-blue-500 text-[10px] text-blue-700">{seat.priceTier}</span>
                  <span className="truncate text-gray-800">{seat?.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">${seat?.priceTier * 50}</span>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Remove ${seat.id}`}
                    onClick={() => deselectSeat(seat.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="px-4 py-3 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-base font-semibold text-gray-900">${totalPrice}</span>
          </div>
          <button
            type="button"
            disabled={selectedSeats.length === 0}
            className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary-dark transition-colors"
          >
            Continue to checkout
          </button>
        </div>
      </div>
    </div>
  );
};