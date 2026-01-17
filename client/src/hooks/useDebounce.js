import { useState, useEffect } from 'react';

/**
 * Custom hook to delay the update of a value.
 * Useful for preventing API/Socket spam on rapid inputs (typing, sliders).
 * * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: If the value changes (user types/slides again) before the delay
    // is over, clear the previous timer and start a new one.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;