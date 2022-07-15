import { useEffect, useRef } from "react";

const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    console.log("iz animate funckije");
    if (
      previousTimeRef.current !== undefined &&
      previousTimeRef.current < 4000
    ) {
      console.log("iz callbacka");
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
  }, []);
};

export default useAnimationFrame;
