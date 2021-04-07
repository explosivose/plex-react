import { MediaContainer, Metadata } from "../common";

/**
 * /library/recentlyAdded
 */
export type RecentlyAddedContainer = MediaContainer<RecentlyAdded>;

export interface RecentlyAdded {
  allowSync: boolean;
  identifier: string;
  mediaTagPrefix: string;
  mixedParents: boolean;
  size: number;
  Metadata: Metadata[]
}
