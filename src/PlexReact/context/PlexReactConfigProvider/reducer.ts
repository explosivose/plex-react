import { Action, ActionType } from "./actions"

export type State =  {
  plexUrl: string;
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SetPlexUrl: {
      return {
        ...state,
        plexUrl: action.plexUrl
      }
    }
    default: {
      throw new Error (`PlexReactConfig Reducer encountered unexpected action (${action.type})`);
    }
  }
}
