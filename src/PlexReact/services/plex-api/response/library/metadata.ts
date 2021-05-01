import { Directory, MediaContainer, Metadata } from "../common";

export type MetadataContainer = MediaContainer<MetadataView>

/**
 * /library/metadata/{key}
 */
export interface MetadataView {
  size: number;
  allowSync: boolean;
  identifier: string;
  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;
  mediaTagPrefix: string;
  mediaTagVersion: number;
/**
 * /library/metadata/{key}/children
 */
  key: string;
  summary?: string;
  theme?: string;
  thumb?: string;
  /**
   * artist (album view)
   * show title (season view)
   * library title (show view)
   */
  title1?: string;
  /**
   * album title (album view)
   * season title (season view)
   * show title (show view)
   */
  title2?: string;
  art?: string;
  banner?: string;
  nocache?: boolean;
  sortAsc?: boolean;
  /**
   * artist title (album view)
   * series title (season view)
   */
  grandparentTitle?: string;
  grandparentThumb?: string;
  // season view
  grandparentContentRating?: string;
  grandparentStudio?: string;
  grandparentTheme?: string;
  /**
   * album title (album view)
   * show title (show view)
   */
  parentTitle?: string;
  parentYear?: number;
  parentIndex?: number;
  /**
   * track (album view)
   * episode (season view)
   * season (show view)
   * undefined (film)
   */
  viewGroup?: string;
  viewMode?: number;
  Metadata?: Metadata[];
  Directory?: Directory[];
}
