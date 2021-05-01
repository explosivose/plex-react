import { MediaContainer, Metadata } from "./common";

/**
 * /playlists
 */
export type PlaylistsContainer = MediaContainer<Playlists>;

export interface Playlists {
  size: number;
  Medadata: Metadata[];
}
