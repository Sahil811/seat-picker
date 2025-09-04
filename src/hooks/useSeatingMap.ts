import { useCallback, useMemo } from 'react';
import { useSeatingStore } from '../store/seatingStore';
import type { Seat } from '../types/venue';

export const useSeatingMap = () => {
  const store = useSeatingStore();
  
  const totalPrice = useMemo(() => 
    store.selectedSeats.reduce((sum, seat) => sum + (seat.priceTier * 50), 0),
    [store.selectedSeats]
  );
  
  const canSelectMoreSeats = useMemo(() => 
    store.selectedSeats.length < 8,
    [store.selectedSeats.length]
  );
  
  const selectSeatOptimized = useCallback((seat: Seat) => {
    if (canSelectMoreSeats && seat.status === 'available') {
      store.selectSeat(seat);
    }
  }, [canSelectMoreSeats, store.selectSeat]);
  
  return {
    ...store,
    totalPrice,
    canSelectMoreSeats,
    selectSeat: selectSeatOptimized
  };
};