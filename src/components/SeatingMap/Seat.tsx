import React, { memo, useCallback } from 'react';
import type { Seat as SeatType } from '../../types/venue';
import { useSeatingStore } from '../../store/seatingStore';

interface SeatProps {
  seat: SeatType;
  isSelected: boolean;
  isFocused: boolean;
  style?: React.CSSProperties;
}

export const Seat: React.FC<SeatProps> = memo(({ seat, isSelected, isFocused, style = {} }) => {
  const { selectSeat, deselectSeat, setFocusedSeat } = useSeatingStore();
  
  const handleClick = useCallback(() => {
    if (seat.status === 'available') {
      if (isSelected) {
        deselectSeat(seat.id);
      } else {
        selectSeat(seat);
      }
    }
  }, [seat, isSelected, selectSeat, deselectSeat]);
  
  const handleFocus = useCallback(() => {
    setFocusedSeat(seat.id);
  }, [seat.id, setFocusedSeat]);
  
  const getSeatStyle = () => {
    // Neutral base for available seats; use stroke color to communicate status
    if (isSelected) {
      return { fill: '#dbeafe', stroke: '#2563eb', strokeWidth: 2 } as const; // blue-100 fill, blue-600 border
    }
    if (seat.status === 'sold') {
      return { fill: '#fee2e2', stroke: '#dc2626', strokeWidth: 1 } as const; // red-200 / red-600
    }
    if (seat.status === 'reserved') {
      return { fill: '#fff7ed', stroke: '#f59e0b', strokeWidth: 1 } as const; // amber-50 / amber-500
    }
    if (seat.status === 'held') {
      return { fill: '#f1f5f9', stroke: '#6b7280', strokeWidth: 1 } as const; // slate-100 / gray-500
    }
    // available (unselected)
    return { fill: '#f8fafc', stroke: '#cbd5e1', strokeWidth: 1 } as const; // slate-50 / slate-300
  };
  const seatStyle = getSeatStyle();
  
  return (
    <rect
      x={seat.x}
      y={seat.y}
      width="20"
      height="20"
      rx="6"
      fill={seatStyle.fill}
      stroke={isFocused ? '#1d4ed8' : seatStyle.stroke}
      strokeWidth={isFocused ? 2 : seatStyle.strokeWidth}
      className="cursor-pointer transition-all duration-150 ease-out hover:brightness-110 hover:drop-shadow-sm focus-visible:outline-none"
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={seat.status === 'available' ? 0 : -1}
      role="button"
      aria-label={`Seat ${seat.id}, ${seat.status}, Price tier ${seat.priceTier}`}
      aria-pressed={isSelected}
      data-seat-id={seat.id}
      style={style}
    >
      <title>{`Seat ${seat.id} • ${seat.status} • $${seat.priceTier * 50}`}</title>
    </rect>
  );
});

Seat.displayName = 'Seat';