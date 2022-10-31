import { useContext } from "react";
import { PhantomContext } from "../contexts/PhantomContext/Context";
import type { PhantomContextValue } from "../contexts/PhantomContext/Context";

/**
 * A hook to access the value of the `TezosContext`. This is a low-level
 * hook that you should usually not need to call directly.
 *
 * @returns {any} the value of the `TezosContext`
 *
 * @example
 *
 * import React from 'react'
 * import { useTezosContext } from 'react-redux'
 *
 * export const CounterComponent = () => {
 *   const { store } = useReduxContext()
 *   return <div>{store.getState()}</div>
 * }
 */
export function usePhantomContext(): PhantomContextValue | null {
  const contextValue = useContext(PhantomContext);

  if (process.env.NODE_ENV !== "production" && !contextValue) {
    throw new Error(
      "could not find react-redux context value; please ensure the component is wrapped in a <PhantomProvider>"
    );
  }

  return contextValue;
}
