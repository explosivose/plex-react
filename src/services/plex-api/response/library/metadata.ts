import { Directory, MediaContainer, Metadata } from "../common";

export type MetadataContainer = MediaContainer<MetadataView | MetadataChildrenView>

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
  Metadata?: Metadata[];
}

/**
 * /library/metadata/{key}/children
 */
export interface MetadataChildrenView {
  size: number;
  key: string;
  librarySectionID: number;
  librarySectionTitle: string;
  librarySectionUUID: string;
  mediaTagPrefix: string;
  mediaTagVersion: string;
  summary: string;
  theme: string;
  thumb: string;
  title1: string;
  title2: string;
  allowSync?: boolean;
  art?: string;
  banner?: string;
  identifier?: string;
  nocache?: boolean;
  sortAsc?: boolean;
  viewGroup?: string;
  viewMode?: number;
  Metadata?: Metadata[];
  Directory?: Directory[];
}