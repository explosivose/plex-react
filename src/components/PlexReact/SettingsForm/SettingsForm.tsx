import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormLabel,
  Input, 
  Stack
} from '@chakra-ui/react';

interface PlexApiSettings {
  plexUrl?: string;
}

type Props = PlexApiSettings & {
  setPlexUrl?: (name: string) => void;
}

export const SettingsForm: FC<Props> = ({
  plexUrl  = 'localhost:32400',
  setPlexUrl,
}) => {

  const [localPlexUrl, setLocalPlexUrl] = useState(plexUrl);

  const submit = () => {
    setPlexUrl?.(localPlexUrl);
  }

  return (
    <Center>
      <Stack width='50vw' maxWidth='400px' spacing='20px'>
        <Box>
          <FormLabel>Plex URL</FormLabel>
          <Input
            defaultValue={plexUrl}
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
