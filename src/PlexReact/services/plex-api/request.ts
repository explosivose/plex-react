import axios, { Method, ResponseType } from "axios";
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
  responseType?: ResponseType;
}

const logger = logdown('plex-react:plex-api/request');

export const plexRequest = async <T>({
  authToken = 'unknown',
  apiUrl = PlexApi.BASE_URL,
  product = Constants.PRODUCT,
  clientId = Constants.CLIENT_ID,
  version = Constants.VERSION,
  method = 'GET',
  endpoint = '/',
  responseType,
}: PlexRequestOptions): Promise<T> => {
  logger.debug('Dispatching request to ', apiUrl, endpoint);
  const { status, statusText, data } = await axios.request<T>({
    method,
    baseURL: apiUrl,
    url: endpoint,
    responseType,
    headers: {
      'Accept': 'application/json',
      'X-Plex-Product': product,
      'X-Plex-Version': version,
      'X-Plex-Client-Identifier': clientId,
      'X-Plex-Token': authToken,
    }
  });
  switch (status) {
    case 200:
      return data;
    default:
      throw new Error(`(${status}, ${statusText}) Error making ${method} request to Plex ${endpoint}`);
  }
};

export const plexQueryFn = <T>(
  {queryKey}: QueryFunctionContext<[string, PlexRequestOptions]>
): Promise<T> => {
  return plexRequest(queryKey[1]);
};
