
import {
  AlbumMetadata,
  ArtistMetadata,
  BaseMetadata,
  EpisodeMetadata,
  FilmMetadata,
  Metadata,
  MetadataType,
  PlaylistMetadata,
  SeasonMetadata,
  ShowMetadata,
  TrackMetadata,
  UnknownMetadata
} from "../../types/metadata";
import {
  AlbumMetadata as PlexAlbum,
  ArtistMetadata as PlexArtist,
  BaseMetadata as PlexBase,
  EpisodeMetadata as PlexEpisode,
  FilmMetadata as PlexFilm,
  PlaylistMetadata as PlexPlaylist,
  SeasonMetadata as PlexSeason,
  ShowMetadata as PlexShow,
  TrackMetadata as PlexTrack,
  Metadata as PlexMetadata,
  MetadataType as PlexMetadataType,
} from "../plex-api/response/common";
import { MetadataView } from "../plex-api/response/library/metadata";

export const convertBaseMetadata = (md: PlexBase): BaseMetadata => ({
  type: md.type || MetadataType.Unknown,
  addedAt: md.addedAt,
  duration: md.duration,
  guid: md.guid || md.key,
  key: md.key,
  summary: md.summary,
  title: md.title || 'undefined',
  updatedAt: md.updatedAt,
  allowSync: md.allowSync,
  art: md.art,
  banner: md.banner,
  theme: md.theme,
  originalTitle: md.originalTitle,
  thumb: md.thumb,
  titleSort: md.titleSort ?? md.title ?? 'undefined',
  viewCount: md.viewCount,
  viewOffset: md.viewOffset,
});

export const convertFilm = (film: PlexFilm): FilmMetadata => ({
  ...convertBaseMetadata(film),
  type: film.type || MetadataType.Film,
  year: film.year,
  studio: film.studio,
  tagline: film.tagline,
  originallyAvailableAt: film.originallyAvailableAt,
  audienceRating: film.audienceRating,
  audienceRatingImage: film.audienceRatingImage,
  ratingImage: film.ratingImage,
  chapterSource: film.chapterSource,
  lastViewedAt: film.lastViewedAt,
});

export const convertShow = (show: PlexShow, seasons?: PlexSeason[]): ShowMetadata => ({
  ...convertBaseMetadata(show),
  type: show.type || MetadataType.Show,
  studio: show.studio,
  year: show.year,
  children: seasons?.map(season => convertSeason(season))
})

export const convertSeason = (season: PlexSeason, episodes?: PlexEpisode[]): SeasonMetadata => ({
  ...convertBaseMetadata(season),
  type: season.type || MetadataType.Season,
  contentRating: season.contentRating,
  index: season.index,
  year: season.year,
  originallyAvailableAt: season.originallyAvailableAt,
  children: episodes?.map(episode => convertEpisode(episode))
});

export const convertEpisode = (episode: PlexEpisode): EpisodeMetadata => ({
  ...convertBaseMetadata(episode),
  type: episode.type || MetadataType.Episode,
  contentRating: episode.contentRating,
  index: episode.index,
  originallyAvailableAt: episode.originallyAvailableAt,
  year: episode.year,
});

export const convertArtist = (artist: PlexArtist, albums?: PlexAlbum[]): ArtistMetadata => ({
  ...convertBaseMetadata(artist),
  type: artist.type || MetadataType.Artist,
  children: albums?.map(album => convertAlbum(album))
})

export const convertAlbum = (album: PlexAlbum, tracks?: PlexTrack[]): AlbumMetadata => ({
  ...convertBaseMetadata(album),
  type: album.type || MetadataType.Album,
  index: album.index,
  originallyAvailableAt: album.originallyAvailableAt,
  year: album.year,
  children: tracks?.map(track => convertTrack(track))
});

export const convertTrack = (track: PlexTrack): TrackMetadata => ({
  ...convertBaseMetadata(track),
  type: track.type || MetadataType.Track 
});

export const convertPlaylist = (playlist: PlexPlaylist, items?: PlexBase[]): PlaylistMetadata => ({
  ...convertBaseMetadata(playlist),
  type: playlist.type || MetadataType.Playlist,
  smart: playlist.smart,
  // TODO playlist items... 
  // children: items?.map(item => convertBaseMetadata(item))
});

export const convertMetadataView = (metadataView: MetadataView): Metadata => {
  const title = metadataView.parentTitle || metadataView.title2 || 'undefined';
  const base: UnknownMetadata = {
    key: metadataView.key,
    guid: metadataView.key,
    type: MetadataType.Unknown,
    title,
    titleSort: title,
    art: metadataView.art,
    thumb: metadataView.thumb,
    banner: metadataView.banner,
    allowSync: metadataView.allowSync,
    parentTitle: metadataView.grandparentTitle,
  }
  switch (metadataView.viewGroup) {
    case "album": {
      return {
        ...base,
        type: MetadataType.Artist,
        children: metadataView.Metadata?.map(album => convertAlbum(album as PlexAlbum)),
      }
    }
    case "track": {
      return {
        ...base,
        type: MetadataType.Album,
        year: metadataView.parentYear,
        children: metadataView.Metadata?.map(track => convertTrack(track as PlexTrack)),
      }
    }
    case "season": {
      return {
        ...base,
        type: MetadataType.Show,
        year: metadataView.parentYear,
        children: metadataView.Metadata?.map(season => convertSeason(season as PlexSeason)),
      }
    }
    case "episode": {
      return {
        ...base,
        type: MetadataType.Season,
        year: metadataView.parentYear,
        children: metadataView.Metadata?.map(episode => convertEpisode(episode as PlexEpisode)),
      }
    }
    default: {
      if (metadataView.Metadata?.length === 1) {
        return convertMetadata(metadataView.Metadata[0]);
      }
      return base;
    }
  }
}

export const convertMetadata = (metadata: PlexMetadata, children?: PlexMetadata[]): Metadata => {
  switch (metadata.type) {
    case PlexMetadataType.Album: {
      return convertAlbum(metadata, children as PlexTrack[]);
    }
    case PlexMetadataType.Track: {
      return convertTrack(metadata);
    }
    case PlexMetadataType.Film: {
      return convertFilm(metadata);
    }
    case PlexMetadataType.Show: {
      return convertShow(metadata, children as PlexSeason[]);
    }
    case PlexMetadataType.Season: {
      return convertSeason(metadata, children as PlexEpisode[]);
    }
    case PlexMetadataType.Episode: {
      return convertEpisode(metadata);
    }
    case PlexMetadataType.Playlist: {
      return convertPlaylist(metadata, children);
    }
    default: {
      return convertBaseMetadata(metadata);
    }
  }
};
