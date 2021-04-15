
export enum ActionType {
  SetEditMode = "setEditMode",
  ToggleEditMode = "toggleEditMode",
}

export interface SetEditModeAction {
  type: ActionType.SetEditMode;
  editModeEnabled: boolean;
}

export interface ToggleEditModeAction {
  type: ActionType.ToggleEditMode;
}

export type Action = SetEditModeAction | ToggleEditModeAction;

