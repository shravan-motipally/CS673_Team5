import React from 'react';
export default function useTimeout(callback: () => void, delay: number) {
  const timeoutRef = React.useRef(null);
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const tick = () => savedCallback.current();
    // @ts-ignore
    timeoutRef.current = window.setTimeout(tick, delay);
    // @ts-ignore
    return () => window.clearTimeout(timeoutRef.current);
  }, [delay]);
  return timeoutRef;
};