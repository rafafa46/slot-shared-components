import { useEffect } from 'react';

export const useScrollReset = (dependency) => {
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-overlay-content]');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, [dependency]);
};