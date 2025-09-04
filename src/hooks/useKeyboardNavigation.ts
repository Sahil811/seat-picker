import { useCallback } from 'react';

export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    console.log('Key pressed', event.key);
  }, []);
  
  return { handleKeyDown };
};