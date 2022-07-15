import { useEffect, useRef } from "react";

const useAnimationFrame = (callback, isSpining = false) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (
      previousTimeRef.current !== undefined &&
      previousTimeRef.current < 4000
    ) {
      callback();
    }
    previousTimeRef.current = time;
    console.log(previousTimeRef.current);
    requestRef.current = requestAnimationFrame(animate);

    if (previousTimeRef.current >= 4000) {
      cancelAnimationFrame(requestRef.current);
      console.log("prestali smo animaciju nakon 4 sekunde");
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
};
