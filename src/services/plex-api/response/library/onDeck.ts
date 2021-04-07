import { MediaContainer, Metadata } from "../common";

/**
 * /library/onDeck
 */
export type OnDeckContainer = MediaContainer<OnDeck>;

export interface OnDeck {
  allowSync: boolean;
  identifier: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  mixedParents: boolean;
  size: number;
  Metadata: Metadata[];
}
