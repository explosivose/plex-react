export enum ActionType {
  SetEditMode = "setEditMode",
  ToggleEditMode = "toggleEditMode",
  ReplaceNodeWithPath = "replaceNodeWithPath",
  ReplaceNodeWithComponent = "replaceNodeWithComponent",
}

type ActionBase<T = ActionType> = {
  type: T;
}

export type ReplaceNodeWithPathAction = ActionBase<ActionType.ReplaceNodeWithPath> & {
  replaceAtPath: number[];
  replaceWithPath: number[];
  removeChildNodes?: boolean;
}

export type ReplaceNodeWithComponentAction = ActionBase<ActionType.ReplaceNodeWithComponent> & {
  replaceAtPath: number[];
  replacementName: string;
  replacementId?: number | string;
  removeChildNodes?: boolean;
}


export type Action = ReplaceNodeWithPathAction
  | ReplaceNodeWithComponentAction;
