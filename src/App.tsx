import React, { useEffect } from 'react';
import Header from './components/Header';
import { SeatingMap } from './components/SeatingMap';
import { useSeatingStore } from './store/seatingStore';
import { mockVenue } from './data/mockVenue';
import './App.css';

function App() {
  const loadVenue = useSeatingStore((state) => state.loadVenue);

  useEffect(() => {
    loadVenue(mockVenue);
  }, [loadVenue]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-xl p-4">
          <SeatingMap />
        </div>
      </main>
    </div>
  );
}

export default App;
