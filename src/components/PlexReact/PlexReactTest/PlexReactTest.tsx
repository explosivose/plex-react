import { Box, Button, Input, Spinner, FormLabel } from '@chakra-ui/react';
import { AxiosError, AxiosResponse } from 'axios';
import logdown from 'logdown';
import React, { FC, useEffect, useState } from 'react';
import { createPlexApi, PlexApiOptions } from '../../../services/plex-api';
import { AxiosErrorViewer } from './AxiosErrorViewer/AxiosErrorViewer';
import { AxiosResponseViewer } from './AxiosResponseViewer/AxiosResponseViewer';

const logger = logdown('plex-react:plex-react-test')
const defaultPlexOpts: PlexApiOptions = {
  baseURL: 'localhost:32400',
  plexProduct: 'Plex React',
  plexVersion: '1.0.0',
  clientId: '4e0a79ff-1688-4427-91ae-62383e4d6277'
}

interface Props {
  plexUrl: string;
  plexUsername?: string;
  plexPassword?: string;
}

export const PlexReactTest: FC<Props> = ({
  plexUrl,
  plexPassword,
  plexUsername,
}) => {
  const [plex, setPlex] = useState(createPlexApi({
    ...defaultPlexOpts,
    baseURL: plexUrl,
    username: plexUsername,
    password: plexPassword,
  }));


  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [route, setRoute] = useState('/');

  useEffect(() => {
    logger.debug('plex settings changed. trigger effect.');
    setError(undefined);
    setLoading(false);
    setData(undefined);
    setPlex(createPlexApi({
      ...defaultPlexOpts,
      baseURL: plexUrl,
      username: plexUsername,
      password: plexPassword,
    }))
  }, [
    plexUrl,
    plexPassword,
    plexUsername
  ])

  const testA = () => {
    logger.debug('test started');
    setLoading(true);
    setData(undefined);
    setError(undefined);
    plex.fetch(route)
      .then(data => {
        logger.debug('test completed');
        setData(data);
        setError(undefined);
        setLoading(false);
      })
      .catch(err => {
        logger.debug('test error');
        setError(err);
        setData(undefined);
        setLoading(false);
      })
  }

  return (
    <Box>
      <FormLabel>Route:</FormLabel>
      <Input
        defaultValue={route}
        onChange={(e) => setRoute(e.currentTarget.value)}
      />
      {loading 
        ? <Spinner />
        : <Box>
            <Button onClick={testA}>Test</Button>
            {data && <AxiosResponseViewer data={data} />}
            {error && <AxiosErrorViewer error={error} />}
          </Box>}
    </Box>
  )
}

