import { Box, Button, Spinner } from '@chakra-ui/react';
import { AxiosError, AxiosResponse } from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { PlexApi, PlexApiOptions } from '../../../services/plex-api';
import { AxiosErrorViewer } from './AxiosErrorViewer/AxiosErrorViewer';
import { AxiosResponseViewer } from './AxiosResponseViewer/AxiosResponseViewer';

const defaultPlexOpts: PlexApiOptions = {
  baseURL: 'localhost:32400',
  plexProduct: 'Plex React',
  plexVersion: '1.0.0',
  clientId: '4e0a79ff-1688-4427-91ae-62383e4d6277'
}

interface Props {
  plexUrl: string;
}

export const PlexReactTest: FC<Props> = ({
  plexUrl,
}) => {
  const [plex, setPlex] = useState(new PlexApi({
    ...defaultPlexOpts,
    baseURL: plexUrl,
  }));

  useEffect(() => {
    setPlex(new PlexApi({
      ...defaultPlexOpts,
      baseURL: plexUrl,
    }))
  }, [plexUrl])

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();

  const testA = () => {
    setLoading(true);
    setData(undefined);
    setError(undefined);
    plex.fetch('/')
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      })
  }

  return (
    <Box>
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

