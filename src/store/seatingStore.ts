import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Venue, Seat } from '../types/venue';

interface SeatingState {
  venue: Venue | null;
  selectedSeats: Seat[];
  focusedSeatId: string | null;
  isLoading: boolean;
  
  // Actions
  loadVenue: (venue: Venue) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelection: () => void;
  setFocusedSeat: (seatId: string | null) => void;
}

export const useSeatingStore = create<SeatingState>()(
  immer((set) => ({
    venue: null,
    selectedSeats: [],
    focusedSeatId: null,
    isLoading: false,
    
    loadVenue: (venue) => set((state) => {
      state.venue = venue;
      state.isLoading = false;
    }),
    
    selectSeat: (seat) => set((state) => {
      if (state.selectedSeats.length < 8 && seat.status === 'available') {
        const exists = state.selectedSeats.find(s => s.id === seat.id);
        if (!exists) {
          state.selectedSeats.push(seat);
        }
      }
    }),
    
    deselectSeat: (seatId) => set((state) => {
      state.selectedSeats = state.selectedSeats.filter(s => s.id !== seatId);
    }),
    
    clearSelection: () => set((state) => {
      state.selectedSeats = [];
    }),
    
    setFocusedSeat: (seatId) => set((state) => {
      state.focusedSeatId = seatId;
    })
  }))
);