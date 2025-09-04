export const mockVenue = {
  venueId: 'venue-1',
  name: 'Example Venue',
  map: { width: 800, height: 600 },
  sections: [
    {
      id: 'section-A',
      label: 'Section A',
      transform: { x: 50, y: 50, scale: 1 },
      rows: Array.from({ length: 10 }, (_, rowIndex) => ({
        index: rowIndex + 1,
        seats: Array.from({ length: 20 }, (_, seatIndex) => ({
          id: `A-${rowIndex + 1}-${seatIndex + 1}`,
          col: seatIndex + 1,
          x: seatIndex * 30,
          y: rowIndex * 30,
          priceTier: (rowIndex + seatIndex) % 3 + 1,
          status: 'available' as const
        }))
      }))
    }
  ]
};