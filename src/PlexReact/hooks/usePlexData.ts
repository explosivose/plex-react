import { useContext } from "react";
import { QueryObserverResult, useQuery } from "react-query"
import { PlexAuthContext } from "../context/PlexAuthProvider";
import { PlexReactConfigContext } from "../context/PlexReactConfigProvider";
import { plexQueryFn, PlexRequestOptions } from "../services/plex-api";

export const usePlexData = <T, E = unknown>(
  endpoint: string
): QueryObserverResult<T, E> => {
  const { authToken } = useContext(PlexAuthContext);
  const [{ plexUrl }] = useContext(PlexReactConfigContext);
  return useQuery<T, E, T, [string, PlexRequestOptions]>(['musicLibrary', {
    authToken,
    apiUrl: plexUrl,
    endpoint,
  }], plexQueryFn);
};
