import { Box, Input, Spinner, FormLabel } from '@chakra-ui/react';
import React, { FC, useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { plexRequest } from '../../../services/plex-api';
import { PlexAuthContext } from '../PlexAuthProvider/PlexAuthProvider';
import { AxiosResponseViewer } from './AxiosResponseViewer/AxiosResponseViewer';

interface Props {
  plexUrl: string;
}

export const PlexReactTest: FC<Props> = ({
  plexUrl,
}) => {


  const [route, setRoute] = useState('/');
  const { authToken } = useContext(PlexAuthContext);
  const { isLoading, data } = useQuery('testQuery', plexRequest({authToken}))


  return (
    <Box>
      <FormLabel>Route:</FormLabel>
      <Input
        defaultValue={route}
        onChange={(e) => setRoute(e.currentTarget.value)}
      />
      {isLoading 
        ? <Spinner />
        : <Box>
            {data && <AxiosResponseViewer data={data} />}
          </Box>}
    </Box>
  )
}
