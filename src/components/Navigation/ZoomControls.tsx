import React from 'react';

export const ZoomControls: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 flex flex-col space-y-2">
      <button
        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      <button
        className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </button>
    </div>
  );
};