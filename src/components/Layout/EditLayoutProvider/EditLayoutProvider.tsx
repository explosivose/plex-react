import React, { createContext, Dispatch, FC, useMemo, useReducer } from "react";
import { Action } from "./actions";
import { reducer, State } from "./reducer";

const initialState: State = {
  editModeEnabled: false,
}
const dummyActionDispatch = () => {
  throw new Error('EditLayoutContext used before initialized');
}

export const EditLayoutContext = createContext<[State, Dispatch<Action>]>([initialState, dummyActionDispatch]);

export const EditLayoutProvider: FC = (props) => {
  const [config, updateConfig] = useReducer(reducer, initialState);
  const memoizedContext = useMemo<[State, Dispatch<Action>]>(() => [config, updateConfig], [config]);
  return <EditLayoutContext.Provider {...props} value={memoizedContext} />;
}
