import React from 'react';

interface ZoomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onFit?: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut, onReset, onFit }) => {
  const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => (
    <button
      className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      {...rest}
    >
      {children}
    </button>
  );

  return (
    <div className="absolute top-4 left-4 flex flex-col p-2 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200">
      <Btn aria-label="Zoom in" onClick={onZoomIn}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
        </svg>
      </Btn>
      <div className="my-1 h-px bg-gray-200" aria-hidden="true" />
      <Btn aria-label="Zoom out" onClick={onZoomOut}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
        </svg>
      </Btn>
      <div className="my-1 h-px bg-gray-200" aria-hidden="true" />
      <Btn aria-label="Fit to screen" onClick={onFit}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" />
        </svg>
      </Btn>
      <div className="my-1 h-px bg-gray-200" aria-hidden="true" />
      <Btn aria-label="Reset view" onClick={onReset}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 5.5v4h4" />
        </svg>
      </Btn>
    </div>
  );
};