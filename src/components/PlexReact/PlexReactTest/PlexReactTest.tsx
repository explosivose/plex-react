import { Box, Input, FormLabel } from '@chakra-ui/react';
import React, { FC, useContext, useState } from 'react';
import { PlexAuthContext } from '../PlexAuthProvider/PlexAuthProvider';
import { PlexReactTestDispatch } from './PlexReactTestDispatch/PlexReactTestDispatch';

interface Props {
  plexUrl: string;
}

export const PlexReactTest: FC<Props> = ({
  plexUrl,
}) => {

  const [route, setRoute] = useState('/');
  const { authToken } = useContext(PlexAuthContext);

  return (
    <Box>
      <FormLabel>Endpoint to test:</FormLabel>
      <Input
        defaultValue={route}
        onChange={(e) => setRoute(e.currentTarget.value)}
      />
      {authToken && <PlexReactTestDispatch
        authToken={authToken}
        apiUrl={plexUrl}
        endpoint={route}
        
      />}
    </Box>
  )
}
