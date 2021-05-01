import React, { createContext, Dispatch, FC, useMemo, useReducer } from "react";
import { Action } from "./actions";
import { reducer, State } from "./reducer";

const initialState: State = {
  plexUrl: ''
}

const dummyActionDispatch = () => {
  throw new Error('PlexReactConfigContext used before initilized.');
}

export const PlexReactConfigContext = createContext<[State, Dispatch<Action>]>([initialState, dummyActionDispatch]);

export const PlexReactConfigProvider: FC = (props) => {
  const [config, updateConfig] = useReducer(reducer, initialState);
  const memoizedContext = useMemo<[State, Dispatch<Action>]>(() => [config, updateConfig], [config]);
  return <PlexReactConfigContext.Provider {...props} value={memoizedContext} />
}
