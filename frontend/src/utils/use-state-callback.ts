import React, { useEffect, useRef, useState } from "react";

/**
 * from https://stackoverflow.com/a/66650583
 * @param initialState
 * @returns
 */
export const useStateWithCallback = <T>(
  initialState: T,
): [
  state: T,
  setState: (
    updatedState: React.SetStateAction<T>,
    callback?: (updatedState: T) => void,
  ) => void,
] => {
  const [state, setState] = useState<T>(initialState);
  const callbackRef = useRef<(updated: T) => void>();

  const handleSetState = (
    updatedState: React.SetStateAction<T>,
    callback?: (updatedState: T) => void,
  ) => {
    callbackRef.current = callback;
    setState(updatedState);
  };

  useEffect(() => {
    if (typeof callbackRef.current === "function") {
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [state]);

  return [state, handleSetState];
};
