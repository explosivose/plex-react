import axios, { AxiosInstance, AxiosResponse } from "axios";
import logdown from "logdown";

const logger = logdown('plex-react:plex-api');

export interface PlexApiOptions {
  baseURL: string;
  plexProduct: string;
  plexVersion: string;
  clientId: string;
  username?: string;
  password?: string;
}

export class PlexApi {
  private _authToken?: string;
  private _axios: AxiosInstance;
  constructor({
    baseURL,
    plexProduct,
    plexVersion,
    clientId,
    username,
    password,
  }: PlexApiOptions) {
    if (!baseURL.toLocaleLowerCase().startsWith('http://') || !baseURL.toLocaleLowerCase().startsWith('https://')) {
      baseURL = `http://${baseURL}`;
    }
    logger.debug('PlexApi instance created.', baseURL);
    this._axios = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Plex-Product': plexProduct,
        'X-Plex-Version': plexVersion,
        'X-Plex-Client-Identifier': clientId,
      },
      auth: username && password ? {username, password} : undefined,
      transformResponse: (data) => {
        if (data?.user?.authToken) {
          this._authToken = data.user.authToken;
        }
      }
    })
  }
  async fetch (url: string): Promise<AxiosResponse> {
    logger.debug('fetch ', url);
    return this._axios.request({
      method: 'GET',
      url,
      headers: {
        ...this._authToken ? {'X-Plex-Token': this._authToken} : {}
      },
    })
  }
}

export const createPlexApi = (opts: PlexApiOptions): PlexApi => new PlexApi(opts); 

export default PlexApi;
