import { Directory, MediaContainer } from "../../common";

/**
 * /library/sections
 */
export type LibrarySectionsContainer = MediaContainer<LibrarySections>;

export interface LibrarySections {
  allowSync: boolean;
  identifier: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  size: number;
  title1: string;
  title2?: string;
  Directory: LibrarySectionDirectory[];
}

export enum LibrarySectionDirectoryType {
  /**
   * a.k.a. music
   */
  Artist = "artist",
  /**
   * a.k.a. film
   */
  Movie = "movie",
  /**
   * a.k.a. TV
   */
  Show = "show",
}

export interface LibrarySectionDirectory extends Directory {
  // count
  // key
  // title
  agent: string;
  allowSync: boolean;
  art: string;
  composite: string;
  content: boolean;
  contentChangedAt: number;
  createdAt: number;
  directory: boolean;
  filters: boolean;
  hidden: number;
  language: string;
  refreshing: boolean;
  scannedAt: number;
  scanner: string;
  thumb: string;
  type: LibrarySectionDirectoryType;
  updatedAt: number;
  uuid: string;
  Location: Location[];
}

export interface Location {
  id: number;
  path: string;
}
