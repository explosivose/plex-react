import { Directory, MediaContainer } from "../../common";

/**
 * /library/sections/{librarySectionID}
 */
export type LibrarySectionContainer = MediaContainer<LibrarySection>;

export interface LibrarySection {
  allowSync: boolean;
  art: string;
  content: string;
  identifier: string;
  librarySectionID: number;
  mediaTagPrefix: string;
  mediaTagVersion: string
  size: number;
  thumb: string;
  title1: string;
  viewGroup: string;
  viewMode: number;
  Directory: Directory[];
}
