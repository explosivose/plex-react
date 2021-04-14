import React, { FC, useContext, useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormLabel,
  Input, 
  Stack
} from '@chakra-ui/react';
import { PlexReactConfigContext, ActionType } from '../PlexReactConfigProvider';


export const SettingsForm: FC = () => {

  const [config, updateConfig] = useContext(PlexReactConfigContext);

  const [localPlexUrl, setLocalPlexUrl] = useState(config.plexUrl);

  const submit = () => {
    updateConfig({type: ActionType.SetPlexUrl, plexUrl: localPlexUrl});
  }

  return (
    <Center margin={4}>
      <Stack width='50vw' maxWidth='400px' spacing='20px'>
        <Box>
          <FormLabel>Plex URL</FormLabel>
          <Input
            defaultValue={config.plexUrl}
            placeholder='http://hostname:port'
            onChange={e => setLocalPlexUrl(e.currentTarget.value)}
          />
        </Box>
        <Button
          onClick={submit}
        >
          Save
        </Button>
      </Stack>
    </Center>
  );
};
