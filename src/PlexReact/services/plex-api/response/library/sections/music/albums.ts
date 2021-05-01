
/**
 * /library/sections/{librarySectionID}/albums
 */

import { AlbumMetadata, MediaContainer } from "../../../common";

 export type AlbumsContainer = MediaContainer<Albums>;

 export interface Albums {
   size: number;
   allowSync: boolean;
   art: string;
   identifier: string;
   mediaTagPrefix: string;
   mediaTagVersion: string;
   mixedParents: boolean;
   nocache: boolean;
   sortAsc: boolean;
   thumb: string;
   title1: string;
   title2: string;
   viewMode: number;
   Metadata: AlbumMetadata[];
 }
 