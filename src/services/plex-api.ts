import axios, { AxiosInstance, AxiosResponse } from "axios";
import logdown from "logdown";

const logger = logdown('plex-react:plex-api');

export interface PlexApiOptions {
  baseUrl: string;
  authUrl?: string;
  plexProduct: string;
  plexVersion: string;
  clientId: string;
}

type PlexApiConfig = Required<PlexApiOptions>;

export class PlexApi {
  private _authToken?: string;
  private _axios: AxiosInstance;
  private _config: PlexApiConfig;
  constructor({
    baseUrl,
    authUrl = 'https://plex.tv/api/v2/pins',
    ...opts
  }: PlexApiOptions) {
    this._config = {...opts, baseUrl, authUrl};
    if (!baseUrl.toLocaleLowerCase().startsWith('http://') || !baseUrl.toLocaleLowerCase().startsWith('https://')) {
      baseUrl = `http://${baseUrl}`;
    }
    if (authUrl.startsWith('http://')) {
      logger.warn('authUrl only supports HTTPS');
      authUrl = authUrl.replace('http://', 'https://');
    }
    if (!authUrl.toLocaleLowerCase().startsWith('https://')) {
      authUrl = `https://${authUrl}`;
    }

    logger.debug('PlexApi instance created.', baseUrl);
    
    this._axios = axios.create({
      baseURL: baseUrl,
      headers: {
        'Accept': 'application/json',
        'X-Plex-Product': opts.plexProduct,
        'X-Plex-Version': opts.plexVersion,
        'X-Plex-Client-Identifier': opts.clientId,
      },
      transformResponse: (data) => {
        if (data?.user?.authToken) {
          this._authToken = data.user.authToken;
        }
      }
    });
  }
  async auth(): Promise<void> {
    logger.debug('auth', this._config.authUrl);
    return axios.post(this._config.authUrl, 'strong=true', {
      headers: {
        'Accept': 'application/json',
        'X-Plex-Product': this._config.plexProduct,
        'X-Plex-Version': 'Plex OAuth',
        'X-Plex-Client-Identifier': this._config.clientId,
        'X-Plex-Model': 'Plex OAuth'
      }
    })
      .then(res => {
        logger.debug('auth response', res.status, res.statusText, res.data);
      })
      .catch(err => {
        logger.error(err);
      });
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
