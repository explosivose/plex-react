import { Box, Input, FormLabel } from '@chakra-ui/react';
import React, { FC, useContext, useState } from 'react';
import { PlexAuthContext } from '../PlexAuthProvider/PlexAuthProvider';
import { PlexReactConfigContext } from '../PlexReactConfigProvider';
import { PlexReactTestDispatch } from './PlexReactTestDispatch/PlexReactTestDispatch';


export const PlexReactTest: FC = () => {

  const [route, setRoute] = useState('/');
  const { authToken } = useContext(PlexAuthContext);
  const [{ plexUrl }] = useContext(PlexReactConfigContext);

  return (
    <Box margin={4} overflow="auto">
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
