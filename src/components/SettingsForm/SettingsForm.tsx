import React, { FC } from 'react';
import { Box, Flex } from 'rebass';
import { Input, Label } from '@rebass/forms';

interface Props {
  plexHostname?: string;
  plexPort?: number;
}

export const SettingsForm: FC<Props> = ({
  plexHostname = '',
  plexPort = 32400,
}) => {
  return (
    <Box
      as='form'
      onSubmit={e => e.preventDefault()}
    >
      <Flex>
        <Box>
          <Label htmlFor='plexHostname' />
          <Input
            id='plexHostname'
            name='plexHostname'
            defaultValue={plexHostname}
          />
        </Box>
        <Box>
          <Label htmlFor='plexPort' />
          <Input
            id='plexPort'
            name='plexPort'
            defaultValue={plexPort}
          />
        </Box>
      </Flex>
    </Box>
  );
};
