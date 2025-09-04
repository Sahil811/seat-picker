import { create } from 'zustand';
import type { Venue, Seat } from '../types/venue';

interface SeatingState {
  venue: Venue | null;
  selectedSeats: Seat[];
  focusedSeatId: string | null;
  isLoading: boolean;
  
  // Actions
  loadVenue: (venue: Venue) => void;
  setLoading: (loading: boolean) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelection: () => void;
  setFocusedSeat: (seatId: string | null) => void;
}

export const useSeatingStore = create<SeatingState>((set) => ({
  venue: null,
  selectedSeats: [],
  focusedSeatId: null,
  isLoading: false,
  
  loadVenue: (venue) => set({ venue, isLoading: false }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  selectSeat: (seat) => set((state) => {
    if (state.selectedSeats.length < 8 && seat.status === 'available') {
      const exists = state.selectedSeats.find(s => s.id === seat.id);
      if (!exists) {
        return { selectedSeats: [...state.selectedSeats, seat] };
      }
    }
    return {};
  }),
  
  deselectSeat: (seatId) => set((state) => ({
    selectedSeats: state.selectedSeats.filter(s => s.id !== seatId)
  })),
  
  clearSelection: () => set({ selectedSeats: [] }),
  
  setFocusedSeat: (focusedSeatId) => set({ focusedSeatId })
}));