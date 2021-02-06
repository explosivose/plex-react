import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Center,
  FormLabel,
  Input, 
  InputGroup,
  InputRightElement,
  Stack
} from '@chakra-ui/react';

interface PlexApiSettings {
  plexUrl?: string;
  plexUsername?: string;
  plexPassword?: string;
}

type Props = PlexApiSettings & {
  setPlexUrl?: (name: string) => void;
  setPlexUsername?: (name: string) => void;
  setPlexPassword?: (pass: string) => void;
}

export const SettingsForm: FC<Props> = ({
  plexUrl  = 'localhost:32400',
  plexUsername = 'username',
  plexPassword = '',
  setPlexUrl,
  setPlexPassword,
  setPlexUsername,
}) => {

  const [localPlexUrl, setLocalPlexUrl] = useState(plexUrl);
  const [localPlexUsername, setLocalPlexUsername] = useState(plexUsername);
  const [localPlexPassword, setLocalPlexPassword] = useState(plexPassword);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  const submit = () => {
    setPlexUrl?.(localPlexUrl);
    setPlexPassword?.(localPlexPassword);
    setPlexUsername?.(localPlexUsername);
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
        <Box>
          <FormLabel>Plex Username</FormLabel>
          <Input
            defaultValue={plexUsername}
            placeholder='Enter username'
            onChange={e => setLocalPlexUsername(e.currentTarget.value)}
          />
        </Box>
        <Box>
          <FormLabel>Plex Password</FormLabel>
          <InputGroup>
            <Input
              defaultValue={plexPassword}
              placeholder='Enter password'
              onChange={e => setLocalPlexPassword(e.currentTarget.value)}
              type={showPassword ? 'text' : 'password'}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={toggleShowPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
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
