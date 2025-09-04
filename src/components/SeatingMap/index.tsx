import React, { useRef } from 'react';
import { useSeatingMap } from '../../hooks/useSeatingMap';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { VirtualizedSeats } from './VirtualizedSeats';
import type { Section, Seat } from '../../types/venue';
import { ZoomControls } from '../Navigation/ZoomControls';

export const SeatingMap: React.FC = () => {
  const { venue, selectedSeats } = useSeatingMap();
  const containerRef = useRef<HTMLDivElement>(null);
  const { handleKeyDown } = useKeyboardNavigation();
  
  if (!venue) return <div>Loading venue...</div>;
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={`${venue?.name} seating map`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${venue?.map.width} ${venue?.map.height}`}
        className="border-none bg-gray-50"
      >
        {venue.sections.map((section: Section) => (
          <g key={section.id} transform={`translate(${section?.transform.x}, ${section?.transform.y}) scale(${section?.transform.scale})`}>
            <VirtualizedSeats section={section} />
          </g>
        ))}
      </svg>
      
      <ZoomControls />
      
      {/* Selection Summary */}
      <>
        <div className="absolute bottom-5 right-5 w-64 bg-white p-4 rounded-xl shadow-lg border border-gray-200 font-sans">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-gray-800">Your Selection</h3>
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {selectedSeats.length}/8
            </span>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {selectedSeats.map((seat: Seat) => (
              <div key={seat.id} className="text-sm py-2 flex justify-between items-center border-b border-gray-100">
                <span>{seat?.id}</span>
                <span className="font-semibold">${seat?.priceTier * 50}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    </div>
  );
};