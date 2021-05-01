
export enum ActionType {
  SetPlexUrl = "setPlexUrl",
}

export interface SetPlexUrlAction {
  type: ActionType.SetPlexUrl
  plexUrl: string;
}

export type Action = SetPlexUrlAction;
