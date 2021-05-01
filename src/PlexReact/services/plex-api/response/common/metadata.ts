import { AudioMedia, VideoMedia } from "./media";

export enum MetadataType {
  Album = "album",
  Artist = "artist",
  Episode = "episode",
  Film = "film",
  Playlist = "playlist",
  Season = "season",
  Track = "track",
  Show = "show",
}

export type Metadata =
  AlbumMetadata |
  ArtistMetadata |
  EpisodeMetadata |
  FilmMetadata |
  PlaylistMetadata |
  SeasonMetadata |
  ShowMetadata |
  TrackMetadata;

export interface BaseMetadata<E = MetadataType> {
  type?: E;
  addedAt?: number;
  duration?: number;
  guid?: string;
  key: string;
  ratingKey?: string;
  summary?: string;
  title?: string;
  updatedAt?: number;
  allowSync?: boolean;
  art?: string;
  banner?: string;
  theme?: string;
  lastViewedAt?: number;
  originalTitle?: string;
  rating?: number;
  ratingCount?: number;
  thumb?: string;
  titleSort?: string;
  viewCount?: number;
  viewOffset?: number;
}

export interface ParentMetadata {
  leafCount?: number;
  viewedLeafCount?: number;
  childCount?: number;
}

export interface ChildMetadata {
  parentKey?: string;
  parentRatingKey?: string;
  parentTitle?: string;
  parentGuid?: string;
  parentIndex?: number;
  parentSummary?: string;
  parentTheme?: string;
  parentThumb?: string;
  parentYear?: number;
}

export interface GrandchildMetadata {
  grandparentKey?: string;
  grandparentRatingKey?: string;
  grandparentTitle?: string;
  grandparentArt?: string;
  grandparentGuid?: string;
  grandparentTheme?: string; 
  grandparentThumb?: string;
}

export interface FilmMetadata extends BaseMetadata<MetadataType.Film> {
  contentRating?: string;
  librarySectionID?: number;
  librarySectionTitle?: string;
  originallyAvailableAt?: string;
  studio?: string;
  year?: number;
  audienceRating?: number;
  audienceRatingImage?: string;
  chapterSource?: string;
  lastViewedAt?: number;
  librarySectionUUID?: string;
  primaryExtraKey?: string;
  ratingImage?: string;
  tagline?: string;
  Media?: VideoMedia[];
  Country?: Tag[];
  Director?: Tag[];
  Genre?: Tag[];
  Role?: Tag[];
  Writer?: Tag[];
}

export interface ShowMetadata extends BaseMetadata<MetadataType.Show>, ParentMetadata {
  studio?: string;
  librarySectionID?: number;
  librarySectionTitle?: string;
  librarySectionKey?: string;
  year?: number;
  Genre?: Tag[];
  Role?: Tag[];
  Similar?: Tag[];
  Location?: Tag[];
}

export interface SeasonMetadata extends BaseMetadata<MetadataType.Season>, ChildMetadata, GrandchildMetadata, ParentMetadata {
  contentRating?: string;
  index?: number;
  leafCount?: number;
  librarySectionID?: number;
  librarySectionKey?: string;
  librarySectionTitle?: string;
  librarySectionUUID?: string;
  originallyAvailableAt?: string;
  year?: number;
  Media?: VideoMedia[];
  Writer?: Tag[];
}

export interface EpisodeMetadata extends BaseMetadata<MetadataType.Episode>, ChildMetadata, GrandchildMetadata {
  contentRating?: string;
  index?: number;
  librarySectionID?: number;
  librarySectionKey?: string;
  librarySectionTitle?: string;
  originallyAvailableAt?: string;
  year?: number;
  Media?: VideoMedia[];
}

export interface PlaylistMetadata extends BaseMetadata<MetadataType.Playlist>, ParentMetadata {
  composite?: string;
  leafCount?: number;
  playlistType?: string;
  smart?: boolean;
}

export interface ArtistMetadata extends BaseMetadata<MetadataType.Artist>, ParentMetadata {
  Genre?: Tag[];
  Country?: Tag[];
  Style?: Tag[];
  Mood?: Tag[];
  Location?: Tag[];
}

export interface AlbumMetadata extends BaseMetadata<MetadataType.Album>, ChildMetadata, ParentMetadata {
  index?: number;
  librarySectionID?: number;
  librarySectionKey?: string;
  librarySectionTitle?: string;
  librarySectionUUID?: string;
  loudnessAnalysisVersion?: string;
  originallyAvailableAt?: string;
  year?: number;
  Director?: Tag[];
  Genre?: Tag[];
}

export interface TrackMetadata extends BaseMetadata<MetadataType.Track>, ChildMetadata, GrandchildMetadata {
  Media?: AudioMedia[];
}

export interface Tag {
  filter?: string;
  id?: number;
  tag?: string;
  role?: string;
  thumb?: string;
}
