import axios, { AxiosInstance, AxiosResponse } from "axios";

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
    this._axios = axios.create({
      baseURL,
      headers: {
        'Accept': 'application/json',
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
    return this._axios.request({
      url,
      headers: {
        ...this._authToken ? {'X-Plex-Token': this._authToken} : {}
      }
    })
  }
}

export default PlexApi;