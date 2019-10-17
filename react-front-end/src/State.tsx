import React, { createContext, useReducer, useContext } from "react";

const StateContext = createContext<any>(null);

export function StateProvider({ children, reducer, initialState }: StateProviderProps ) {
  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(StateContext);
}
