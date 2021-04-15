import logdown from 'logdown';
import React, {
  createContext,
  FC,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  checkPin, 
  generatePin,
  getAuthUrl,
  poll,
  verifyToken
} from '../../../services/plex-api';

const logger = logdown('plex-react:plex-auth-provider');

interface PlexAuth {
  authToken?: string;
}

export const PlexAuthContext = createContext<PlexAuth>({});

// PlexProvider will provide the API token for queries with a specific server
export const PlexAuthProvider: FC = (props) => {

  const [userToken, setUserToken] = useState('');
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const [pinId, setPinId] = useState<undefined | number>();
  
  // verify user token 
  useEffect(() => {
    async function verify() {
      try {
        const valid = await verifyToken({userToken});
        setTokenIsValid(valid);
        logger.debug('User token valid=', valid);
      } catch (err: unknown) {
        logger.error(err);
        setTokenIsValid(false);
      }
    }
    logger.debug('Verifying user token...');
    verify();
  }, [userToken]);

  // authenticate when token is invalid
  useEffect(() => {
    async function authenticate() {
      try {
        const { code, id } = await generatePin();
        const authUrl = getAuthUrl({code});
        // open plex auth page
        window.open(authUrl, '_blank')?.focus();
        setPinId(id);
      } catch (err: unknown) {
        logger.error(err);
      }
    }
    if (!tokenIsValid) {
      logger.debug('User token not valid. Authenticating...');
      authenticate();
    }
  }, [tokenIsValid]);

  // check pin is claimed by user at authentication
  useEffect(() => {
    async function pinChecker() {
      let authToken: string | undefined = undefined;
      if (pinId !== undefined) {
        try {
          authToken = await checkPin({id: pinId});
        } catch (err: unknown) {
          logger.error(err);
        }
      } else {
        logger.warn('Cannot check pin because it is undefined.');
      }
      return authToken;
    }
    async function pollPinCheck() {
      let authToken: string | undefined = undefined;
      try {
        authToken = await poll(pinChecker);
      } catch (err: unknown) {
        logger.error(err);
      }
      if (authToken) {
        logger.debug('Auth token recieved.');
        setUserToken(authToken);
      }
    }
    if (pinId !== undefined) {
      logger.debug('Checking if user pin has been claimed...');
      pollPinCheck();
    }
  }, [pinId]);

  // create auth context value
  const plexAuth = useMemo<PlexAuth>(() => ({
    authToken: userToken
  }), [userToken]);

  return <PlexAuthContext.Provider {...props} value={plexAuth} />
};
 