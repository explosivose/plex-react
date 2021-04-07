import { MediaContainer, Metadata } from "./common";


/**
 * /hubs
 */
export type HubsContainer = MediaContainer<Hubs>;

export interface Hubs {
  allowSync: boolean;
  identifier: string;
  size: number;
  Hub: Hub[];
}

export enum HubType {
  Album = "album",
  Clip = "clip",
  Episode = "episode",
  Mixed = "mixed",
  Movie = "movie",
  Photo = "photo",
  Playlist = "playlist",
}

export interface Hub {
  context: string;
  hubIdentifier: string;
  hubKey: string;
  key: string;
  more: boolean;
  promoted: boolean;
  size: number;
  style: string;
  title: string;
  type: HubType;
  Metadata?: Metadata[];
}
