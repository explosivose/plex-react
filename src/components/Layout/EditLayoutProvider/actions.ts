import { Serializable } from "../Layout";

export enum ActionType {
  SetEditMode = "setEditMode",
  ToggleEditMode = "toggleEditMode",
  ReplaceNodeWithPath = "replaceNodeWithPath",
  ReplaceNodeWithComponent = "replaceNodeWithComponent",
  RemoveNode = "removeNode",
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
  replacementProps?: Record<string, Serializable>;
  replacementId?: number | string;
  /**
   * If true, adopt the childNodes from the replaced node.
   */
  adoptChildNodes?: boolean;
  /**
   * Reattach the replaced node as a child of the replacement node at index.
   * This option overrides removeChildNodes
   */
  reattachAsChild?: number;
}

export type RemoveNodeAction = ActionBase<ActionType.RemoveNode> & {
  removeAtPath: number[];
}


export type Action = ReplaceNodeWithPathAction
  | ReplaceNodeWithComponentAction
  | RemoveNodeAction;
  