import { useRef, useEffect } from 'react';

/**
 * A hook to create a game loop using requestAnimationFrame
 * @param callback The function to call on each animation frame
 */
const useGameLoop = (callback: () => void) => {
  // Use a ref to store the callback to avoid unnecessary re-renders
  const requestRef = useRef<number>();
  const callbackRef = useRef(callback);
  
  // Update the callback ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // The actual animation loop
  useEffect(() => {
    const animate = () => {
      callbackRef.current();
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start the animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up when the component unmounts
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount
};

export default useGameLoop;
