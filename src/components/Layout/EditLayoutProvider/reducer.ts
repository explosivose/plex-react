import logdown from "logdown";
import { LayoutNode } from "../Layout";
import { Action, ActionType } from "./actions"

const logger = logdown("layout/editLayoutReducer");

export type State = {
  editModeEnabled: boolean;
  layout: LayoutNode[];
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.SetEditMode: {
      logger.debug("Set edit mode: ", action.editModeEnabled);
      return {
        ...state,
        editModeEnabled: action.editModeEnabled
      }
    }
    case ActionType.ToggleEditMode: {
      logger.debug("Set edit mode: ", !state.editModeEnabled);
      return {
        ...state,
        editModeEnabled: !state.editModeEnabled
      }
    }
    default: {
      const type = (action as {type: unknown}).type
      throw new Error (`EditLayout Reducer encountered unexpected action (${type})`);
    }
  }
};
