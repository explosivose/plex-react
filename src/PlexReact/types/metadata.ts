
export enum MetadataType {
  Album = "album",
  Artist = "artist",
  Episode = "episode",
  Film = "film",
  Playlist = "playlist",
  Season = "season",
  Track = "track",
  Show = "show",
  Unknown = "unknown"
}

export interface BaseMetadata<E extends MetadataType = MetadataType> {
  key: string;
  guid: string;
  type: E;

  title: string;
  titleSort: string;
  originalTitle?: string;
  summary?: string;

  art?: string;
  banner?: string;
  theme?: string;
  thumb?: string;


  viewCount?: number;
  viewOffset?: number;

  addedAt?: number;
  updatedAt?: number;
  duration?: number;

  grandparentTitle?: string;
  grandparentKey?: string;

  parentKey?: string;
  parentTitle?: string;
  

  allowSync?: boolean;
}

interface ParentMetadata {
  leafCount?: number;
  viewedLeafCount?: number;
  childCount?: number;
}

interface ChildMetadata {
  parentKey?: string;
  parentTitle?: string;
  parentIndex?: number;
  parentSummary?: string;
  parentThumb?: string;
  parentYear?: number;
}

interface GrandchildMetadata {
  grandparentTitle?: string;
  grandparentKey?: string;
}

export interface FilmMetadata extends BaseMetadata<MetadataType.Film> {
  year?: number;
  studio?: string;
  tagline?: string;
  originallyAvailableAt?: string;

  audienceRating?: number;
  audienceRatingImage?: string;
  ratingImage?: string;
  chapterSource?: string;

  lastViewedAt?: number;
}

export interface ShowMetadata extends BaseMetadata<MetadataType.Show>, ParentMetadata {
  studio?: string;
  year?: number;
  children?: SeasonMetadata[];
}

export interface SeasonMetadata extends BaseMetadata<MetadataType.Season>, ChildMetadata, ParentMetadata {
  contentRating?: string;
  index?: number;
  year?: number;
  originallyAvailableAt?: string;
  children?: EpisodeMetadata[];
}

export interface EpisodeMetadata extends BaseMetadata<MetadataType.Episode>, ChildMetadata, GrandchildMetadata {
  contentRating?: string;
  index?: number;
  originallyAvailableAt?: string;
  year?: number;
}

export interface PlaylistMetadata extends BaseMetadata<MetadataType.Playlist>, ParentMetadata {
  smart?: boolean;
  children?: BaseMetadata[];
}

export interface ArtistMetadata extends BaseMetadata<MetadataType.Artist>, ParentMetadata {
  children?: AlbumMetadata[];
}

export interface AlbumMetadata extends BaseMetadata<MetadataType.Album>, ParentMetadata, ChildMetadata {
  index?: number;
  originallyAvailableAt?: string;
  year?: number;
  children?: TrackMetadata[];
}

export interface TrackMetadata extends BaseMetadata<MetadataType.Track>, ChildMetadata, GrandchildMetadata {};

export type UnknownMetadata = BaseMetadata<MetadataType.Unknown>;

export type Metadata = FilmMetadata |
  ShowMetadata |
  SeasonMetadata |
  EpisodeMetadata |
  PlaylistMetadata |
  ArtistMetadata |
  AlbumMetadata |
  TrackMetadata |
  UnknownMetadata;
