import React, { useMemo } from 'react';
import { List } from 'react-window';
import type { Section } from '../../types/venue';
import { Seat } from './Seat';
import { useSeatingStore } from '../../store/seatingStore';

interface VirtualizedSeatsProps {
  section: Section;
}

export const VirtualizedSeats: React.FC<VirtualizedSeatsProps> = ({ section }) => {
  const { selectedSeats, focusedSeatId } = useSeatingStore();
  
  const allSeats = useMemo(() => 
    section.rows.flatMap(row => row.seats), 
    [section.rows]
  );
  
  const selectedSeatIds = useMemo(() => 
    new Set(selectedSeats.map(s => s.id)), 
    [selectedSeats]
  );
  
  // For large sections, implement virtualization
  if (allSeats.length > 1000) {
    return (
      <List
        height={600}
        itemCount={allSeats.length}
        itemSize={30}
        width={800}
      >
        {({ index }: { index: number }) => {
          const seat = allSeats[index];
          if (!seat) return null;
          return (
            <Seat
              key={seat.id}
              seat={seat}
              isSelected={selectedSeatIds.has(seat.id)}
              isFocused={focusedSeatId === seat.id}
            />
          );
        }}
      </List>
    );
  }
  
  // Regular rendering for smaller sections
  return (
    <g>
      {allSeats.map(seat => (
        <Seat
          key={seat.id}
          seat={seat}
          isSelected={selectedSeatIds.has(seat.id)}
          isFocused={focusedSeatId === seat.id}
        />
      ))}
    </g>
  );
};