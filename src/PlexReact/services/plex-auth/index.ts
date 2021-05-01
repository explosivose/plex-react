import axios from "axios";
import { Constants, PlexApi } from "../../config";
import { stringify } from "qs";
import { PlexBaseOptions } from "../plex-api/request";

export interface PlexVerifyOptions extends PlexBaseOptions {
  userToken: string;
  verifyEndpoint?: string;
}

export interface PlexAuthUrlOptions extends PlexBaseOptions {
  code: string;
}

export interface PlexCheckPinOptions extends PlexBaseOptions {
  id: number;
}

// https://forums.plex.tv/t/authenticating-with-plex/609370
export const verifyToken = async({
  userToken,
  verifyEndpoint = PlexApi.USER,
  apiUrl = PlexApi.BASE_URL,
  product = Constants.PRODUCT,
  clientId = Constants.CLIENT_ID,
}: PlexVerifyOptions): Promise<boolean> => {
  const {status, statusText} = await axios.get(`${apiUrl}${verifyEndpoint}`, {
    headers: {
      'Accept': 'application/json',
      'X-Plex-Product': product,
      'X-Plex-Client-Identifier': clientId,
      'X-Plex-Token': userToken
    },
    validateStatus: undefined,
  });
  switch (status) {
    case 200:
      return true;
    case 401:
      return false;
    default:
      throw new Error (`Error verifying token (${status}: ${statusText})`);
  }
}

// https://forums.plex.tv/t/authenticating-with-plex/609370
export const generatePin = async(opts: PlexBaseOptions = {
  apiUrl: PlexApi.BASE_URL,
  product: Constants.PRODUCT,
  clientId: Constants.CLIENT_ID,
}): Promise<{id: number; code: string}> => {
  const {apiUrl, product, clientId} = opts;
  const {data, status, statusText} = await axios.post(`${apiUrl}${PlexApi.PINS}`,
  'strong=true', {
    headers: {
      'Accept': 'application/json',
      'X-Plex-Product': product,
      'X-Plex-Client-Identifier': clientId,
    },
    validateStatus: undefined,
  });
  switch (status) {
    case 200:
    case 201:
      return {id: data.id, code: data.code};
    default:
      throw new Error (`Error generating pin (${status}: ${statusText})`);
  }
};

// https://forums.plex.tv/t/authenticating-with-plex/609370
export const getAuthUrl = ({
  code,
  apiUrl = PlexApi.AUTH_URL,
  product = Constants.PRODUCT,
  clientId = Constants.CLIENT_ID,
}: PlexAuthUrlOptions): string => {
  return `${apiUrl}#?${stringify({
    clientID: clientId,
    code,
    // forwardUrl: window.location.href,
    context: {
      device: { product }
    }
  })}`;
};

export const checkPin = async({
  id,
  apiUrl = PlexApi.BASE_URL,
  clientId = Constants.CLIENT_ID
}: PlexCheckPinOptions): Promise<string | undefined> => {
  const {data, status, statusText} = await axios.get(`${apiUrl}${PlexApi.PINS}/${id}`, {
    headers: {
      'Accept': 'application/json',
      'X-Plex-Client-Identifier': clientId,
    },
    validateStatus: undefined,
  });
  switch (status) {
    case 200:
      return data?.authToken ?? undefined;
    default:
      throw new Error(`Error checking pin (${status}: ${statusText})`);
  }
};

export const poll = async<T>(
  fn: () => Promise<T>,
  interval = 1000,
  timeout = 10 * 1000,
  validate = (result: T) => result !== undefined && result !== null,
): Promise<T> => {
  const endTime = new Date().getTime() + timeout;
  const pollingFunction = async(resolve: (value: T) => void, reject: (reason?: unknown) => void) => {
    const result = await fn();
    if (validate(result)) {
      return resolve(result);
    } else if (new Date().getTime() < endTime) {
      setTimeout(pollingFunction, interval, resolve, reject);
    } else {
      reject(new Error('Timeout reached while polling...'));
    }
  }
  return new Promise(pollingFunction);
};
