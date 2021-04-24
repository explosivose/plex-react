import axios, { AxiosResponse, Method } from "axios";
import { Constants, PlexApi } from "../../config";
import logdown from "logdown";
import { QueryFunctionContext } from "react-query";

export interface PlexBaseOptions {
  apiUrl?: string;
  product?: string;
  clientId?: string;
}

export interface PlexRequestOptions extends PlexBaseOptions {
  authToken?: string;
  endpoint?: string;
  version?: string;
  method?: Method;
}

const logger = logdown('plex-react:plex-api/request');

export const plexRequest = <T>({
  authToken = 'unknown',
  apiUrl = PlexApi.BASE_URL,
  product = Constants.PRODUCT,
  clientId = Constants.CLIENT_ID,
  version = Constants.VERSION,
  method = 'GET',
  endpoint = '/',
}: PlexRequestOptions): Promise<AxiosResponse<T>> => {
  logger.debug('Dispatching request to ', apiUrl, endpoint);
  return axios.request<T>({
    method,
    baseURL: apiUrl,
    url: endpoint,
    headers: {
      'Accept': 'application/json',
      'X-Plex-Product': product,
      'X-Plex-Version': version,
      'X-Plex-Client-Identifier': clientId,
      'X-Plex-Token': authToken,
    }
  });
}

export const plexRequestBuffer = <T>({
  authToken = 'unknown',
  apiUrl = PlexApi.BASE_URL,
  product = Constants.PRODUCT,
  clientId = Constants.CLIENT_ID,
  version = Constants.VERSION,
  method = 'GET',
  endpoint = '/'
}: PlexRequestOptions): Promise<AxiosResponse<T>> => {
  return axios.request<T>({
    method,
    baseURL: apiUrl,
    url: endpoint,
    responseType: 'arraybuffer',
    headers: {
      'X-Plex-Product': product,
      'X-Plex-Version': version,
      'X-Plex-Client-Identifier': clientId,
      'X-Plex-Token': authToken,
    }
  })
}

export const plexQueryFn = <T>(
  {queryKey}: QueryFunctionContext<[string, PlexRequestOptions]>
): Promise<AxiosResponse<T>> => {
  return plexRequest(queryKey[1]);
};

export const plexQueryFnBuffer = <T>(
  {queryKey}: QueryFunctionContext<[string, PlexRequestOptions]>
): Promise<AxiosResponse<T>> => {
  return plexRequestBuffer(queryKey[1]);
}
