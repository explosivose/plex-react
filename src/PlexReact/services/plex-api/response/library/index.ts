import { Directory, MediaContainer } from "../common";

/**
 * /library
 */
export type LibraryContainer = MediaContainer<Library>;

export interface Library {
  allowSync: boolean;
  art: string;
  content: string;
  identifier: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
  size: number;
  title1: string;
  title2: string;
  Directory: Directory[];
}
