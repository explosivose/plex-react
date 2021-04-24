import { AxiosResponse } from "axios";
import { useContext } from "react";
import { QueryObserverResult, useQuery } from "react-query";
import { plexQueryFn, PlexRequestOptions } from "../services/plex-api";
import { AlbumsContainer } from "../services/plex-api/response/library/sections/music";
import { PlexAuthContext } from "../context/PlexAuthProvider/PlexAuthProvider"
import { PlexReactConfigContext } from "../context/PlexReactConfigProvider";

type AlbumsResponse = AxiosResponse<AlbumsContainer>;

export const useMusicLibrary = (
  endpoint = '/library/sections/3/albums',
): QueryObserverResult<AlbumsResponse, unknown> => {
  const { authToken } = useContext(PlexAuthContext);
  const [{ plexUrl }] = useContext(PlexReactConfigContext);
  return useQuery<AlbumsResponse, unknown, AlbumsResponse, [string, PlexRequestOptions]>(['musicLibrary', {
    authToken,
    apiUrl: plexUrl,
    endpoint,
  }], plexQueryFn);
};
