import React, { FC, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';

interface Props {
  plexUrl?: string;
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
    <Box
      as='form'
      onSubmit={submit}
    >
      <Flex>
        <Box>
          <FormControl id='plexUrl'>
            <FormLabel>Plex URL</FormLabel>
            <Input
              defaultValue={plexUrl}
              onChange={(e) => setLocalPlexUrl(e.currentTarget.value)}
            />
          </FormControl>
        </Box>
        <Button
          onClick={submit}
        />
      </Flex>
    </Box>
  );
};
