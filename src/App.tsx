import React, { useEffect } from 'react';
import Header from './components/Header';
import { SeatingMap } from './components/SeatingMap';
import { useSeatingStore } from './store/seatingStore';
import { mockVenue } from './data/mockVenue';

function App() {
  const loadVenue = useSeatingStore((state) => state.loadVenue);

  useEffect(() => {
    loadVenue(mockVenue);
  }, [loadVenue]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <Header />
      <main className="container mx-auto px-6 py-8">
        <section className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-200">
          <div className="p-4 md:p-6">
            <SeatingMap />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
