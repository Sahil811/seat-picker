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
  
  const getSeatColor = () => {
    if (seat.status === 'sold') return '#dc2626';
    if (seat.status === 'reserved') return '#f59e0b';
    if (seat.status === 'held') return '#6b7280';
    if (isSelected) return '#2563eb';
    return '#10b981';
  };
  
  return (
    <rect
      x={seat.x}
      y={seat.y}
      width="20"
      height="20"
      rx="2"
      fill={getSeatColor()}
      stroke={isFocused ? '#1d4ed8' : 'none'}
      strokeWidth={isFocused ? 2 : 0}
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleClick}
      onFocus={handleFocus}
      tabIndex={seat.status === 'available' ? 0 : -1}
      role="button"
      aria-label={`Seat {seat.id}, {seat.status}, Price tier {seat.priceTier}`}
      aria-pressed={isSelected}
      data-seat-id={seat.id}
      style={style}
    />
  );
});

Seat.displayName = 'Seat';